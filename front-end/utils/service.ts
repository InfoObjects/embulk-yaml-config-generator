import _ from "lodash";

export const debounce = (func: any, timeout: any = 300) => {
  let timer: any;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export const parseSchema = (row: any, schema: any) => {
  let result: any = {};
  result.value = getNumberParser(row.value || row.defaultValue || "");
  let hiddenWhen = null;
  if (row?.hiddenWhen) {
    hiddenWhen = _.find(schema, { title: row.hiddenWhen });
  }
  result.show =
    row.show ||
    (hiddenWhen
      ? hiddenWhen.hasOwnProperty("show")
        ? !hiddenWhen.show
        : row.required
      : row.required);
  result.error = false;
  result.errorMsg = "";
  result.canHide = hiddenWhen
    ? hiddenWhen.hasOwnProperty("show")
      ? hiddenWhen.show
      : !row.required
    : !row.required;
  result.parentArr = row.parentArr || [];
  if (
    row.type === "multiple_key_objects" ||
    row.type === "array_of_objects" ||
    row.type === "array_of_strings" ||
    row.type === "multiple_key_value"
  ) {
    result.children = row.children || [];
  } else if (row.type === "nested" || row.type === "nested_without_title") {
    result.children =
      row.children ||
      getParsedSchema(row.options, result.parentArr, row.type, row.title);
  }
  return { ...row, ...result };
};

export const getParsedSchema = (
  items: any,
  parentArr?: any,
  type?: any,
  title?: any
) => {
  const inSchema: any = [];
  if (!_.isEmpty(items)) {
    items.forEach((row: any) => {
      let rowItem = _.cloneDeep(row);
      if (type && (type === "nested" || type === "nested_without_title")) {
        rowItem.parentArr = _.cloneDeep(parentArr);
        rowItem.parentArr.push({ type: "nested", title: title });
        rowItem.nested = title;
      }
      rowItem = parseSchema(rowItem, items);
      inSchema.push(rowItem);
    });
  }
  return inSchema;
};

export const getNumberParser = (str: any) => {
  let result = str;
  if (str) {
    const num = _.toNumber(str);
    if (_.isInteger(num)) {
      result = num;
    }
  }
  return result;
};

export const hasWhiteSpace = (s: any) => {
  return s.indexOf(" ") >= 0;
};
