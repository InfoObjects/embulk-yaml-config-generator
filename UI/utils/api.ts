import axios from "axios";

const endpoint = "http://localhost:3200/";

export const apicall = async (
  callType: string,
  path: string,
  apiBody?: any
) => {
  const url = endpoint + path;
  switch (callType) {
    case "post":
      return await axios.post(url, apiBody);
    case "get":
      return await axios.get(url);
    default:
      return {};
  }
};

export const readYaml = (yaml: any) => {
  return apicall("post", "read-yaml", yaml);
};

export const saveYaml = (yaml: any) => {
  return apicall("post", "save-yaml", yaml);
};

export const deployEmbulk = (yaml: any) => {
  return apicall("post", "deploy-embulk", yaml);
};
