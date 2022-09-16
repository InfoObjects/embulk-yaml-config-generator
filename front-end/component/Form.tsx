import React, { useEffect, useState } from "react";
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import * as _ from "lodash";
import {
  getNumberParser,
  parseSchema,
  getParsedSchema,
} from "../utils/service";

type Prop = {
  schema: any;
  title?: string;
  type?: string;
  callback: (result: any, title?: string, type?: string) => void;
};

const Forms: React.FC<Prop> = ({ schema, callback, title, type }) => {
  const [inputes, setInputes] = useState<any>([]);

  useEffect(() => {
    setInputes([...getParsedSchema(schema)]);
  }, [schema]);

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const genratOutput = (items: any) => {
    let jsonYml: any;
    if (items[0].type === "nested_without_title") {
      jsonYml = [];
    } else {
      jsonYml = {};
    }
    items.forEach((item: any) => {
      if (item.show) {
        if (
          item.type === "text" ||
          item.type === "textarea" ||
          item.type === "radio"
        ) {
          if (
            item.value !== "" &&
            item.value !== undefined &&
            item.value !== null
          ) {
            jsonYml[item.title] = item.value;
          }
        } else if (item.type === "multiple_key_objects") {
          if (!_.isEmpty(item.children) && item.show) {
            jsonYml[item.title] = {};
            item.children.forEach((child: any) => {
              const keyIndex = _.findIndex(child, { title: "key_name" });
              if (
                child[keyIndex].value !== "" &&
                child[keyIndex].value !== undefined &&
                child[keyIndex].value !== null
              ) {
                const childTemp = _.cloneDeep(child);
                childTemp.splice(keyIndex, 1);
                jsonYml[item.title][child[keyIndex].value] =
                  genratOutput(childTemp);
              }
            });
          }
        } else if (item.type === "multiple_key_value") {
          if (!_.isEmpty(item.children) && item.show) {
            jsonYml[item.title] = {};
            item.children.forEach((child: any) => {
              const keyObj = _.find(child, { title: "key" });
              const valueObj = _.find(child, { title: "value" });
              if (
                keyObj.value !== "" &&
                keyObj.value !== undefined &&
                keyObj.value !== null
              ) {
                jsonYml[item.title][keyObj.value] = valueObj.value;
              }
            });
          }
        } else if (item.type === "array_of_objects") {
          if (!_.isEmpty(item.children) && item.show) {
            jsonYml[item.title] = [];
            item.children.forEach((child: any) => {
              jsonYml[item.title].push(genratOutput(child));
            });
          }
        } else if (item.type === "array_of_strings") {
          if (!_.isEmpty(item.children) && item.show) {
            jsonYml[item.title] = [];
            item.children.forEach((child: any) => {
              jsonYml[item.title].push(child[0].value);
            });
          }
        } else if (item.type === "nested") {
          if (!_.isEmpty(item.children) && item.show) {
            jsonYml[item.title] = genratOutput(item.children);
          }
        } else if (item.type === "nested_without_title") {
          if (!_.isEmpty(item.children) && item.show) {
            jsonYml.push(genratOutput(item.children));
          }
        }
      }
    });
    return jsonYml;
  };

  const saveChanges = (items: any) => {
    const jsonRes = genratOutput(items);
    setInputes([...items]);
    callback(jsonRes, title, type);
  };

  const findUpdateInputeItem: any = (
    parentArr: any,
    items: any,
    findTitle: any
  ) => {
    if (parentArr.length === 0) {
      return items;
    } else {
      const thisParent = _.cloneDeep(parentArr[0]);
      parentArr.splice(0, 1);
      const thisItems = _.find(items, { title: thisParent.title });
      if (thisParent.type === "array") {
        return findUpdateInputeItem(
          parentArr,
          thisItems.children[thisParent.myIndex],
          findTitle
        );
      } else {
        return findUpdateInputeItem(parentArr, thisItems.children, findTitle);
      }
    }
  };

  const updatefindInputeItem: any = (
    parentArr: any,
    items: any,
    findTitle: any,
    update: any
  ) => {
    if (parentArr.length === 0) {
      const index = _.findIndex(items, { title: findTitle });
      items[index] = update;
    } else {
      const thisParent = _.cloneDeep(parentArr[0]);
      parentArr.splice(0, 1);
      const index = _.findIndex(items, { title: thisParent.title });
      if (thisParent.type === "array") {
        items[index].children[thisParent.myIndex] = updatefindInputeItem(
          parentArr,
          items[index].children[thisParent.myIndex],
          findTitle,
          update
        );
      } else {
        items[index].children = updatefindInputeItem(
          parentArr,
          items[index].children,
          findTitle,
          update
        );
      }
    }
    return items;
  };

  const updateInputeItem = (tempInputes: any) => {
    const parentArr = _.cloneDeep(tempInputes.parentArr);
    const items = updatefindInputeItem(
      parentArr,
      inputes,
      tempInputes.title,
      tempInputes
    );
    saveChanges([...items]);
  };

  const handleChange = (event: any, item: any) => {
    const parentArr = _.cloneDeep(item.parentArr);
    let tempInputes = findUpdateInputeItem(parentArr, inputes, item.title);
    const index = _.findIndex(tempInputes, { title: item.title });

    tempInputes[index].value = getNumberParser(event.target.value);
    if (
      tempInputes[index].show &&
      (!event.target.value || event.target.value === "")
    ) {
      tempInputes[index].error = true;
    } else {
      tempInputes[index].error = false;
    }

    updateInputeItem(tempInputes[index]);
  };

  const AddItemInput = (item: any) => {
    const parentArr = _.cloneDeep(item.parentArr);
    let tempInputes = findUpdateInputeItem(parentArr, inputes, item.title);
    const index = _.findIndex(tempInputes, { title: item.title });
    let visible = true;

    if (tempInputes[index]?.hiddenWhen) {
      const hiddenWhen = _.findIndex(tempInputes, {
        title: tempInputes[index].hiddenWhen,
      });
      tempInputes[hiddenWhen].show = false;
      tempInputes[hiddenWhen].error = false;
      const showWhen = _.filter(tempInputes, {
        showWhen: tempInputes[index].hiddenWhen,
      });
      showWhen.forEach((row: any) => {
        const ind = _.findIndex(tempInputes, { title: row.title });
        tempInputes[ind].show = false;
        tempInputes[ind].error = false;
      });
      const showMyChild = _.filter(tempInputes, {
        showWhen: tempInputes[index].title,
      });
      showMyChild.forEach((row: any) => {
        const ind = _.findIndex(tempInputes, { title: row.title });
        if (tempInputes[ind].required) {
          tempInputes[ind].show = true;
          tempInputes[ind].error = false;
        }
      });
    } else if (tempInputes[index]?.showWhen) {
      const showWhen = _.findIndex(tempInputes, {
        title: tempInputes[index].showWhen,
      });
      if (!tempInputes[showWhen].show) {
        visible = false;
        tempInputes[index].error = true;
        tempInputes[index].errorMsg =
          tempInputes[showWhen].title + " must be enable.";
      }
    }

    if (visible) {
      tempInputes[index].show = true;
      tempInputes[index].error = false;
    }

    updateInputeItem(tempInputes[index]);
  };

  const removeItemInput = (item: any) => {
    const parentArr = _.cloneDeep(item.parentArr);
    let tempInputes = findUpdateInputeItem(parentArr, inputes, item.title);
    const index = _.findIndex(tempInputes, { title: item.title });

    if (tempInputes[index]?.hiddenWhen) {
      const hiddenWhen = _.findIndex(tempInputes, {
        title: tempInputes[index].hiddenWhen,
      });
      tempInputes[hiddenWhen].show = true;
      tempInputes[hiddenWhen].error = false;
      const showWhen = _.filter(tempInputes, {
        showWhen: tempInputes[index].hiddenWhen,
      });
      showWhen.forEach((row: any) => {
        const ind = _.findIndex(tempInputes, { title: row.title });
        if (tempInputes[ind].required) {
          tempInputes[ind].show = true;
          tempInputes[ind].error = false;
        }
      });
      const showMyChild = _.filter(tempInputes, {
        showWhen: tempInputes[index].title,
      });
      showMyChild.forEach((row: any) => {
        const ind = _.findIndex(tempInputes, { title: row.title });
        tempInputes[ind].show = false;
        tempInputes[ind].error = false;
      });
    }

    tempInputes[index].show = false;
    tempInputes[index].error = false;
    updateInputeItem(tempInputes[index]);
  };

  const hideButtonRender = (input: any) => {
    return input.canHide ? (
      <Button
        variant="outline-danger"
        size="sm"
        className="fs-8 float-end"
        onClick={() => removeItemInput(input)}
      >
        X
      </Button>
    ) : null;
  };

  const addChildrenInputs = (input: any) => {
    const inSchema: any = [];
    let myIndex = input.children.length;

    if (input.type === "multiple_key_objects") {
      let obj = parseSchema(
        {
          title: "key_name",
          type: "text",
          required: true,
          withQuotes: false,
          parent: input.title,
          myIndex: myIndex,
        },
        schema
      );
      obj.parentArr = _.cloneDeep(input.parentArr);
      obj.parentArr.push({
        type: "array",
        title: input.title,
        myIndex: myIndex,
      });
      inSchema.push(obj);
    }
    if (input.type === "array_of_strings") {
      let obj = parseSchema(
        {
          title: "",
          type: "text",
          required: true,
          withQuotes: false,
          parent: input.title,
          myIndex: myIndex,
        },
        schema
      );
      obj.parentArr = _.cloneDeep(input.parentArr);
      obj.parentArr.push({
        type: "array",
        title: input.title,
        myIndex: myIndex,
      });
      inSchema.push(obj);
    } else {
      input.options.forEach((row: any) => {
        let obj = parseSchema(row, schema);
        obj.parent = input.title;
        obj.myIndex = myIndex;
        obj.parentArr = _.cloneDeep(input.parentArr);
        if (input.type === "nested") {
          obj.parentArr.push({ type: "nested", title: input.title });
        } else {
          obj.parentArr.push({
            type: "array",
            title: input.title,
            myIndex: myIndex,
          });
        }
        inSchema.push(obj);
      });
    }
    const result = _.cloneDeep(input);
    result.children.push(inSchema);
    updateInputeItem(result);
  };

  const removeChildrenInputs = (input: any, index: any) => {
    input.children.splice(index, 1);
    input.children.map((rowChild: any, i: any) => {
      return rowChild.map((row: any, ii: any) => {
        row.myIndex = i;
        row.parentArr.map((pr: any, pi: any) => {
          if (pr.type === "array") {
            pr.myIndex = i;
          }
          return pr;
        });
        return row;
      });
    });
    updateInputeItem(input);
  };

  const getInputRender = (input: any, index: any) => {
    switch (input.type) {
      case "radio":
        return (
          <Form.Group
            key={input.title + "-" + index}
            as={Col}
            md="12"
            controlId={input.title}
            className="fs-7 mt-1"
          >
            <Form.Label className="fs-7 fw-bold d-block mb-0">
              {input.title}
            </Form.Label>
            <InputGroup>
              {input.options.map((row: any, index: number) => {
                return (
                  <span key={"radio-" + row + index} className="me-3">
                    <Form.Check
                      inline
                      type="radio"
                      name={input.title}
                      label={row}
                      //id={input.title + row}
                      value={row}
                      checked={row === input.value}
                      onChange={(e) => handleChange(e, input)}
                    />
                  </span>
                );
              })}
              {hideButtonRender(input)}
            </InputGroup>
          </Form.Group>
        );
      case "text":
        return (
          <Form.Group
            key={input.title + "-" + index}
            as={Col}
            md="12"
            className="mt-1"
            controlId={input.title}
          >
            <Form.Label className="fs-7 fw-bold mb-0">{input.title}</Form.Label>
            <InputGroup>
              <Form.Control
                required
                size="sm"
                name={input.title}
                type="text"
                value={input.value}
                onChange={(e) => handleChange(e, input)}
                disabled={input?.readOnly}
                isInvalid={input.error}
              />
              {hideButtonRender(input)}
              <Form.Control.Feedback className="fs-8 m-0" type="invalid">
                This field is required.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        );
      case "textarea":
        return (
          <Form.Group
            key={input.title + "-" + index}
            as={Col}
            md="12"
            className="mt-1"
            controlId={input.title}
          >
            <Form.Label className="fs-7 fw-bold mb-0">{input.title}</Form.Label>
            <InputGroup>
              <Form.Control
                required
                size="sm"
                name={input.title}
                type="text"
                value={input.value}
                onChange={(e) => handleChange(e, input)}
                as="textarea"
                rows={3}
                disabled={input?.readOnly}
                isInvalid={input.error}
              />
              {hideButtonRender(input)}
              <Form.Control.Feedback className="fs-8 m-0" type="invalid">
                This field is required.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        );
      case "multiple_key_objects":
        return (
          <div key={input.title + "-" + index} className="mt-1 col-md-12">
            <fieldset className="with-border">
              <legend className="with-border fs-7">{input.title}</legend>
              <div className="p-2">
                <div className="text-end" style={{ marginTop: "-10px" }}>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="fs-8"
                    style={{ top: "-10px" }}
                    onClick={() => removeItemInput(input)}
                  >
                    X
                  </Button>
                </div>
                <div>
                  {!_.isEmpty(input.children) &&
                    input.children.map((rowChild: any, rcInd: any) => {
                      return (
                        <div
                          key={input.title + "-" + index + "-" + rcInd}
                          className="mt-1 p-2 border border-secondary"
                        >
                          <Row>
                            <Col md="12">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="fs-8"
                                onClick={() =>
                                  removeChildrenInputs(input, rcInd)
                                }
                              >
                                Remove this {input.title}
                              </Button>
                            </Col>
                            {rowChild.map((row: any, rInd: any) => {
                              return row.show
                                ? getInputRender(
                                    row,
                                    index + "-" + rcInd + "-" + rInd
                                  )
                                : getHiddenRender(
                                    row,
                                    index + "-" + rcInd + "-" + rInd
                                  );
                            })}
                          </Row>
                        </div>
                      );
                    })}
                </div>
                <div className="pt-1">
                  <Button
                    variant="outline-dark"
                    size="sm"
                    className="fs-8"
                    onClick={() => addChildrenInputs(input)}
                  >
                    Add More {input.title}
                  </Button>
                </div>
              </div>
            </fieldset>
          </div>
        );
      case "multiple_key_value":
        return (
          <div key={input.title + "-" + index} className="mt-1 col-md-12">
            <fieldset className="with-border">
              <legend className="with-border fs-7">{input.title}</legend>
              <div className="p-2">
                <div className="text-end" style={{ marginTop: "-10px" }}>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="fs-8"
                    style={{ top: "-10px" }}
                    onClick={() => removeItemInput(input)}
                  >
                    X
                  </Button>
                </div>
                <div>
                  {!_.isEmpty(input.children) &&
                    input.children.map((rowChild: any, rcInd: any) => {
                      return (
                        <div
                          key={input.title + "-" + index + "-" + rcInd}
                          className="mt-1 p-2 border border-secondary"
                        >
                          <Row>
                            <Col md="12">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="fs-8"
                                onClick={() =>
                                  removeChildrenInputs(input, rcInd)
                                }
                              >
                                Remove this {input.title}
                              </Button>
                            </Col>
                            {rowChild.map((row: any, rInd: any) => {
                              return row.show
                                ? getInputRender(
                                    row,
                                    index + "-" + rcInd + "-" + rInd
                                  )
                                : getHiddenRender(
                                    row,
                                    index + "-" + rcInd + "-" + rInd
                                  );
                            })}
                          </Row>
                        </div>
                      );
                    })}
                </div>
                <div className="pt-1">
                  <Button
                    variant="outline-dark"
                    size="sm"
                    className="fs-8"
                    onClick={() => addChildrenInputs(input)}
                  >
                    Add More {input.title}
                  </Button>
                </div>
              </div>
            </fieldset>
          </div>
        );
      case "array_of_objects":
        return (
          <div key={input.title + "-" + index} className="mt-1 col-md-12">
            <fieldset className="with-border">
              <legend className="with-border fs-7">{input.title}</legend>
              <div className="p-2">
                <div className="text-end" style={{ marginTop: "-10px" }}>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="fs-8"
                    style={{ top: "-10px" }}
                    onClick={() => removeItemInput(input)}
                  >
                    X
                  </Button>
                </div>
                <div>
                  {!_.isEmpty(input.children) &&
                    input.children.map((rowChild: any, rcInd: any) => {
                      return (
                        <div
                          key={input.title + "-" + index + "-" + rcInd}
                          className="mt-1 p-2 border border-secondary"
                        >
                          <Row>
                            <Col md="12">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="fs-8"
                                onClick={() =>
                                  removeChildrenInputs(input, rcInd)
                                }
                              >
                                Remove this {input.title}
                              </Button>
                            </Col>
                            {rowChild.map((row: any, rInd: any) => {
                              return row.show
                                ? getInputRender(
                                    row,
                                    index + "-" + rcInd + "-" + rInd
                                  )
                                : getHiddenRender(
                                    row,
                                    index + "-" + rcInd + "-" + rInd
                                  );
                            })}
                          </Row>
                        </div>
                      );
                    })}
                </div>
                <div className="pt-1">
                  <Button
                    variant="outline-dark"
                    size="sm"
                    className="fs-8"
                    onClick={() => addChildrenInputs(input)}
                  >
                    Add More {input.title}
                  </Button>
                </div>
              </div>
            </fieldset>
          </div>
        );
      case "array_of_strings":
        return (
          <div key={input.title + "-" + index} className="mt-1 col-md-12">
            <fieldset className="with-border">
              <legend className="with-border fs-7">{input.title}</legend>
              <div className="p-2">
                <div className="text-end" style={{ marginTop: "-10px" }}>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="fs-8"
                    style={{ top: "-10px" }}
                    onClick={() => removeItemInput(input)}
                  >
                    X
                  </Button>
                </div>
                <div>
                  {!_.isEmpty(input.children) &&
                    input.children.map((rowChild: any, rcInd: any) => {
                      return (
                        <div
                          key={input.title + "-" + index + "-" + rcInd}
                          className="mt-1 p-2 border border-secondary"
                        >
                          <Row>
                            <Col md="12">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="fs-8"
                                onClick={() =>
                                  removeChildrenInputs(input, rcInd)
                                }
                              >
                                Remove this {input.title}
                              </Button>
                            </Col>
                            {rowChild.map((row: any, rInd: any) => {
                              return row.show
                                ? getInputRender(
                                    row,
                                    index + "-" + rcInd + "-" + rInd
                                  )
                                : getHiddenRender(
                                    row,
                                    index + "-" + rcInd + "-" + rInd
                                  );
                            })}
                          </Row>
                        </div>
                      );
                    })}
                </div>
                <div className="pt-1">
                  <Button
                    variant="outline-dark"
                    size="sm"
                    className="fs-8"
                    onClick={() => addChildrenInputs(input)}
                  >
                    Add More {input.title}
                  </Button>
                </div>
              </div>
            </fieldset>
          </div>
        );
      case "nested":
        return (
          <div key={input.title + "-" + index} className="mt-1 col-md-12">
            <fieldset className="with-border">
              <legend className="with-border fs-7">{input.title}</legend>
              <div className="p-2">
                {input.canHide ? (
                  <div className="text-end" style={{ marginTop: "-10px" }}>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="fs-8"
                      style={{ top: "-10px" }}
                      onClick={() => removeItemInput(input)}
                    >
                      X
                    </Button>
                  </div>
                ) : null}
                <div>
                  <Row>
                    {!_.isEmpty(input.children) &&
                      input.children.map((rowChild: any, rcInd: any) => {
                        return rowChild.show
                          ? getInputRender(rowChild, index + "-" + rcInd)
                          : getHiddenRender(rowChild, index + "-" + rcInd);
                      })}
                  </Row>
                </div>
              </div>
            </fieldset>
          </div>
        );
      case "nested_without_title":
        return (
          <div key={input.title + "-" + index} className="mt-1 col-md-12">
            <fieldset className="with-border">
              <legend className="with-border fs-7">{input.title}</legend>
              <div className="p-2">
                {input.canHide ? (
                  <div className="text-end" style={{ marginTop: "-10px" }}>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="fs-8"
                      style={{ top: "-10px" }}
                      onClick={() => removeItemInput(input)}
                    >
                      X
                    </Button>
                  </div>
                ) : null}
                <div>
                  <Row>
                    {!_.isEmpty(input.children) &&
                      input.children.map((rowChild: any, rcInd: any) => {
                        return rowChild.show
                          ? getInputRender(rowChild, index + "-" + rcInd)
                          : getHiddenRender(rowChild, index + "-" + rcInd);
                      })}
                  </Row>
                </div>
              </div>
            </fieldset>
          </div>
        );
      default:
        return null;
    }
  };

  const getHiddenRender = (input: any, index: any) => {
    return (
      <Form.Group
        key={input.title + "-" + index}
        as={Col}
        md="12"
        className="mt-1"
        controlId={input.title}
      >
        <Form.Label className="fs-7 fw-bold mb-0">{input.title}</Form.Label>
        <Button
          variant="outline-primary"
          size="sm"
          className="fs-8 float-end"
          onClick={() => AddItemInput(input)}
        >
          Add {input.title}
        </Button>
        {input.error && (
          <div className="fs-8 text-danger">{input.errorMsg}</div>
        )}
      </Form.Group>
    );
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Row>
        {!_.isEmpty(inputes) &&
          inputes.map((row: any, index: any) => {
            return row.show
              ? getInputRender(row, index)
              : getHiddenRender(row, index);
          })}
      </Row>
    </Form>
  );
};

export default Forms;
