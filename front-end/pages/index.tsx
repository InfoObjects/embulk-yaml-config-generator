import type { NextPage } from "next";
import Accordions from "../component/Atoms/Accordion";
import TabLayout from "../component/Atoms/Tab";
import { embulkOptions } from "../utils/constants";
import { Accordion, Card } from "react-bootstrap";
import { useCallback, useState } from "react";
import Forms from "../component/Form";
import {
  mysqlSchema,
  csvSchema,
  postgresSchema,
  jdbcSchema,
  msSqlSchema,
  sendEmailSchema,
  exec,
  filters,
} from "../utils/configSchema";
import fileDownload from "js-file-download";
import _ from "lodash";
import { parseSchema, getParsedSchema, debounce } from "../utils/service";
import { saveYaml, readYaml, deployEmbulk } from "../utils/api";
import Modal from "../component/Atoms/Modal";
import CodeMirrors from "../component/Atoms/CodeMirror";
import FileName from "../component/Atoms/FileName";

const Home: NextPage = () => {
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [fileName, setFileName] = useState<boolean>(false);
  const [btnType, setBtnType] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<any>({
    accordion: null,
    tab: null,
  });
  const [schema, setSchema] = useState<any>({
    exec: null,
    in: null,
    filters: null,
    out: null,
  });
  const [embulInputs, setEmbulInputs] = useState<any>({
    json: {
      exec: null,
      in: null,
      filters: null,
      out: null,
    },
    yaml: "",
    error: "",
  });

  const onAccordionChange = (title: any) => {
    if (selectedItem.accordion !== title) {
      if (title === "in" || title === "out") {
        if (embulInputs.json[title]?.type) {
          onOptionChange(embulInputs.json[title].type, title);
        } else {
          onOptionChange(embulkOptions[0].key, title);
        }
      } else {
        onDefaultSchemaUpdate(title);
        setSelectedItem({ ...selectedItem, accordion: title });
      }
    }
  };

  const genratInput = (items: any, values: any) => {
    let result: any = _.cloneDeep(items);
    result.map((item: any, index: any) => {
      if (values && values[item.title]) {
        if (
          item.type === "text" ||
          item.type === "textarea" ||
          item.type === "radio"
        ) {
          item.value = values[item.title].toString();
          item.show = true;
        } else if (item.type === "multiple_key_value") {
          const children: any = [];
          const keys = _.keys(values[item.title]);
          for (let ki = 0; ki < keys.length; ki++) {
            const childrenRow: any = [];
            item.options.forEach((iRow: any) => {
              let obj = parseSchema(iRow, items);
              obj.parent = item.title;
              obj.myIndex = ki;
              obj.value =
                obj.title === "key" ? keys[ki] : values[item.title][keys[ki]];
              obj.parentArr = _.cloneDeep(item.parentArr);
              obj.parentArr.push({
                type: "array",
                title: item.title,
                myIndex: ki,
              });
              childrenRow.push(obj);
            });
            children.push(genratInput(childrenRow, values[item.title]));
          }

          item.show = true;
          item.children = children;
        } else if (item.type === "multiple_key_objects") {
          const children: any = [];
          const keys = _.keys(values[item.title]);
          for (let ki = 0; ki < keys.length; ki++) {
            const childrenRow: any = [];
            let obj = parseSchema(
              {
                title: "key_name",
                type: "text",
                required: true,
                withQuotes: false,
                parent: item.title,
                myIndex: ki,
                value: keys[ki],
              },
              items
            );
            obj.parentArr = _.cloneDeep(item.parentArr);
            obj.parentArr.push({
              type: "array",
              title: item.title,
              myIndex: ki,
            });
            childrenRow.push(obj);
            item.options.forEach((iRow: any) => {
              let obj = parseSchema(iRow, items);
              obj.parent = item.title;
              obj.myIndex = ki;
              obj.parentArr = _.cloneDeep(item.parentArr);
              obj.parentArr.push({
                type: "array",
                title: item.title,
                myIndex: ki,
              });
              childrenRow.push(obj);
            });
            children.push(
              genratInput(childrenRow, values[item.title][keys[ki]])
            );
          }
          item.show = true;
          item.children = children;
        } else if (item.type === "array_of_objects") {
          const children: any = [];

          for (let ki = 0; ki < values[item.title].length; ki++) {
            const childrenRow: any = [];
            item.options.forEach((iRow: any) => {
              let obj = parseSchema(iRow, items);
              obj.parent = item.title;
              obj.myIndex = ki;
              obj.parentArr = _.cloneDeep(item.parentArr);
              obj.parentArr.push({
                type: "array",
                title: item.title,
                myIndex: ki,
              });
              childrenRow.push(obj);
            });
            children.push(genratInput(childrenRow, values[item.title][ki]));
          }
          item.show = true;
          item.children = children;
        } else if (item.type === "array_of_strings") {
          const childrenRow: any = [];
          for (let ki = 0; ki < values[item.title].length; ki++) {
            let obj = parseSchema(
              {
                title: "",
                type: "text",
                required: true,
                withQuotes: false,
                parent: item.title,
                myIndex: ki,
                value: values[item.title][ki],
              },
              schema
            );
            obj.parentArr = _.cloneDeep(item.parentArr);
            obj.parentArr.push({
              type: "array",
              title: item.title,
              myIndex: ki,
            });
            childrenRow.push([obj]);
          }
          item.show = true;
          item.children = childrenRow;
        } else if (item.type === "nested") {
          const childs = _.cloneDeep(item.children);
          item.children = genratInput(childs, values[item.title]);
          item.show = true;
        }
      } else if (item.type === "nested_without_title") {
        if (values) {
          for (let vi = 0; vi < values.length; vi++) {
            if (_.has(values[vi], item.title)) {
              const childs = _.cloneDeep(item.children);
              item.children = genratInput(childs, _.cloneDeep(values[vi]));
              item.show = true;
              break;
            } else if (
              values[vi].type === item.title ||
              values[vi].rule === item.title
            ) {
              const childs = _.cloneDeep(item.children);
              item.children = genratInput(childs, _.cloneDeep(values[vi]));
              item.show = true;
              break;
            }
          }
        }
      }
      return item;
    });
    return result;
  };

  const putSavedValues = (items: any, accordion: any, tab: any) => {
    const values = _.cloneDeep(embulInputs.json[accordion]);
    if (accordion === "in" || accordion === "out") {
      if (values?.type && values.type === tab) {
        const tmpSchema = getParsedSchema(items[accordion]);
        const result = genratInput(tmpSchema, values);
        items[accordion] = result;
      }
    } else if (accordion === "exec") {
      const tmpSchema = getParsedSchema(items[accordion]);
      const result = genratInput(tmpSchema, values);
      items[accordion] = result;
    } else if (accordion === "filters") {
      const tmpSchema = getParsedSchema(items[accordion]);
      const result = genratInput(tmpSchema, values);
      items[accordion] = result;
    }
    return items;
  };

  const onDefaultSchemaUpdate = (title: string) => {
    if (title === "exec") {
      schema[title] = _.cloneDeep(exec);
    } else if (title === "filters") {
      schema[title] = _.cloneDeep(filters);
    }
    setSchema({ ...putSavedValues(schema, title, null) });
  };

  const onOptionChange = (eventName: any, type: string) => {
    if (eventName === "mysql") {
      if (type === "in" || type === "out") {
        schema[type] = _.cloneDeep([
          ...mysqlSchema.common,
          ...mysqlSchema[type === "in" ? "input" : "output"],
        ]);
        setSchema({ ...putSavedValues(schema, type, eventName) });
      }
    } else if (eventName === "file") {
      if (type === "in" || type === "out") {
        schema[type] = _.cloneDeep([
          ...csvSchema.common,
          ...csvSchema[type === "in" ? "input" : "output"],
        ]);
        setSchema({ ...putSavedValues(schema, type, eventName) });
      }
    } else if (eventName === "postgresql") {
      if (type === "in" || type === "out") {
        schema[type] = _.cloneDeep([
          ...postgresSchema.common,
          ...postgresSchema[type === "in" ? "input" : "output"],
        ]);
        setSchema({ ...putSavedValues(schema, type, eventName) });
      }
    } else if (eventName === "jdbc") {
      if (type === "in" || type === "out") {
        schema[type] = _.cloneDeep([
          ...jdbcSchema.common,
          ...jdbcSchema[type === "in" ? "input" : "output"],
        ]);
        setSchema({ ...putSavedValues(schema, type, eventName) });
      }
    } else if (eventName === "sqlserver") {
      if (type === "in" || type === "out") {
        schema[type] = _.cloneDeep([
          ...msSqlSchema.common,
          ...msSqlSchema[type === "in" ? "input" : "output"],
        ]);
        setSchema({ ...putSavedValues(schema, type, eventName) });
      }
    } else if (eventName === "send_email") {
      if (type === "out") {
        schema[type] = _.cloneDeep([
          ...sendEmailSchema.common,
          ...sendEmailSchema["output"],
        ]);
        setSchema({ ...putSavedValues(schema, type, eventName) });
      }
    } else if (eventName === "stdout") {
      if (type === "out") {
        setSchema({ ...schema, out: null });
        getJsonResponse({}, type, eventName);
      }
    } else {
      setSchema({ ...schema, in: null, out: null });
    }
    setSelectedItem({ accordion: type, tab: eventName });
  };

  const getJsonResponse = (result: any, title?: string, type?: string) => {
    //console.log("getJsonResponse", result, selectedItem);
    let updateFlag = true;
    if (
      !title &&
      (selectedItem.accordion === "in" || selectedItem.accordion === "out")
    ) {
      embulInputs.json[selectedItem.accordion] = {
        type: selectedItem.tab,
        ...result,
      };
    } else {
      if (title && type) {
        embulInputs.json[title] = {
          type: type,
          ...result,
        };
      } else if (title) {
        embulInputs.json[title] = result;
      } else {
        updateFlag = false;
      }
    }
    if (updateFlag) {
      let jsonObj: any = {};
      if (embulInputs.json.exec) {
        jsonObj.exec = embulInputs.json.exec;
      }
      if (embulInputs.json.in) {
        jsonObj.in = embulInputs.json.in;
      }
      if (embulInputs.json.filters) {
        jsonObj.filters = embulInputs.json.filters;
      }
      if (embulInputs.json.out) {
        jsonObj.out = embulInputs.json.out;
      }
      jsonObj = JSON.stringify(jsonObj);
      Promise.resolve(saveYaml({ yaml: jsonObj })).then((res: any) => {
        if (res.data.error) {
        } else {
          embulInputs.error = "";
          embulInputs.yaml = res.data.data;
          //console.log('Promise', res.data.data);
        }
        setEmbulInputs({ ...embulInputs });
      });
    }
  };

  const getJsonResponseDebounce = debounce(getJsonResponse, 400);

  const getInOutRender = (schemaData: any, title?: string, type?: string) => {
    return title || selectedItem?.tab ? (
      <Card className="mt-3">
        <Card.Body className="bg-light">
          <h4>{title || selectedItem.tab}</h4>
          <Forms
            schema={schemaData}
            callback={getJsonResponseDebounce}
            title={title}
            type={type}
          />
        </Card.Body>
      </Card>
    ) : null;
  };

  const closeModal = () => {
    setShowEditor(false);
    setFileName(false);
  };

  const saveYamlEditor = (value: String) => {
    if (value !== embulInputs.yaml) {
      Promise.resolve(readYaml({ yaml: value })).then((res: any) => {
        if (res.data.error) {
          let snippet = res.data.data.mark.snippet.split("\n");
          const errorIndex = _.findIndex(snippet, (o: any) => {
            return o.indexOf("^") > -1;
          });
          const errorLine = snippet[errorIndex - 1];
          snippet[errorIndex - 1] = snippet[errorIndex];
          snippet[errorIndex] = errorLine;
          embulInputs.error =
            res.data.data.reason +
            " (" +
            res.data.data.mark.line +
            ":" +
            res.data.data.mark.column +
            ")\n" +
            snippet.join("\n");
        } else {
          embulInputs.error = "";
          embulInputs.json.exec = null;
          embulInputs.json.in = null;
          embulInputs.json.filters = null;
          embulInputs.json.out = null;
          embulInputs.yaml = value;
          const data = res.data.data;
          if (data.exec) {
            embulInputs.json.exec = data.exec;
          }
          if (data.in) {
            embulInputs.json.in = data.in;
          }
          if (data.filters) {
            embulInputs.json.filters = data.filters;
          }
          if (data.out) {
            embulInputs.json.out = data.out;
          }
          closeModal();
          if (
            selectedItem.accordion === "in" ||
            selectedItem.accordion === "out"
          ) {
            onOptionChange(
              embulInputs.json[selectedItem.accordion].type,
              selectedItem.accordion
            );
          } else {
            onDefaultSchemaUpdate(selectedItem.accordion);
          }
        }
        setEmbulInputs({ ...embulInputs });
      });
    } else {
      closeModal();
      embulInputs.error = "";
      setEmbulInputs({ ...embulInputs });
    }
  };

  const downloadFile = (fileName: String) => {
    try {
      fileDownload(embulInputs.yaml, `${fileName}.yml`);
      console.log("successfully downloaded");
    } catch (error) {
      console.log(error);
    }
  };

  const deployFile = (fileName: String) => {
    Promise.resolve(
      deployEmbulk({ yaml: embulInputs.yaml, fileName: fileName })
    ).then((res: any) => {
      if (res.data.error) {
        console.log(res.data.message);
      } else {
        console.log(res.data);
      }
    });
  };

  const saveFileName = (fileName: String) => {
    setFileName(false);
    if (btnType === "download") {
      downloadFile(fileName);
    } else if (btnType === "deploy") {
      deployFile(fileName);
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "65px",
          left: "0px",
          width: "50%",
          bottom: "0px",
          overflow: "auto",
        }}
      >
        <div className="data-config">
          <div className="accordion accordion-flush" id="accordionEmbulk">
            <Accordion>
              <Accordions
                title="Execution"
                param="exec"
                callBack={onAccordionChange}
              >
                {getInOutRender(schema.exec, "exec")}
              </Accordions>
              <Accordions title="Input" param="in" callBack={onAccordionChange}>
                <TabLayout
                  tabs={embulkOptions}
                  type="in"
                  selectedTab={selectedItem.tab}
                  onTabSelect={onOptionChange}
                >
                  {getInOutRender(schema.in)}
                </TabLayout>
              </Accordions>
              <Accordions
                title="Filters"
                param="filters"
                callBack={onAccordionChange}
              >
                {getInOutRender(schema.filters, "filters")}
              </Accordions>
              <Accordions
                title="Output"
                param="out"
                callBack={onAccordionChange}
              >
                <TabLayout
                  tabs={[
                    ...embulkOptions,
                    {
                      key: "send_email",
                      name: "Send Email",
                    },
                    {
                      key: "stdout",
                      name: "stdout",
                    },
                  ]}
                  type="out"
                  selectedTab={selectedItem.tab}
                  onTabSelect={onOptionChange}
                >
                  {getInOutRender(schema.out)}
                </TabLayout>
              </Accordions>
            </Accordion>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          top: "65px",
          right: "0px",
          width: "50%",
          bottom: "0px",
          overflow: "auto",
        }}
      >
        <div className="d-flex justify-content-end align-items-center pb-2 mb-1 border-bottom">
          <div className="btn-toolbar mb-2 mb-md-0">
            <div className="btn-group me-2">
              <button
                type="button"
                onClick={() => setShowEditor(true)}
                className="btn btn-sm btn-outline-secondary"
              >
                <i className="fa-solid fa-edit"></i> Edit
              </button>
            </div>

            <div className="btn-group me-2">
              <button
                type="button"
                onClick={() => {
                  setFileName(true);
                  setBtnType("download");
                }}
                className="btn btn-sm btn-outline-secondary"
              >
                <i className="fa-solid fa-save"></i> Download
              </button>
            </div>

            <div className="btn-group me-2">
              <button
                type="button"
                onClick={() => {
                  setFileName(true);
                  setBtnType("deploy");
                }}
                className="btn btn-sm btn-outline-secondary"
              >
                <i className="fa-solid fa-check-to-slot"></i> Deploy
              </button>
            </div>
          </div>
        </div>

        <pre>
          <code>{embulInputs.yaml}</code>
        </pre>
      </div>
      <Modal
        title="Yaml Editor"
        onClose={closeModal}
        show={showEditor}
        size="xl"
      >
        <CodeMirrors saveYaml={saveYamlEditor} yamlText={embulInputs.yaml} />
        <div className="text-danger fs-8">
          <pre>
            <code>{embulInputs.error}</code>
          </pre>
        </div>
      </Modal>
      <Modal
        title="Enter Flile name"
        onClose={closeModal}
        show={fileName}
        size="sm"
      >
        <FileName setFileName={saveFileName} />
      </Modal>
    </>
  );
};

export default Home;
