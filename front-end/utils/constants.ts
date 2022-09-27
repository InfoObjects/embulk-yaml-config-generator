import {
  mysqlSchema,
  csvSchema,
  postgresSchema,
  jdbcSchema,
  msSqlSchema,
} from "./configSchema";

/***** 
 * embulkOptions variable has plugin object which we will use into our application. 
 * Each object has 3 types of properties key, name & plugin.
 * key will be use into YAML output as plugin type.
 * name will be use to display on application UI.
 * plugin is the object schema of fields.
*****/
export const embulkOptions = [
  {
    key: "file",
    name: "CSV",
    plugin: csvSchema
  },
  {
    key: "mysql",
    name: "MySQL",
    plugin: mysqlSchema
  },
  {
    key: "postgresql",
    name: "Postgres",
    plugin: postgresSchema
  },
  {
    key: "jdbc",
    name: "Oracle",
    plugin: jdbcSchema
  },
  {
    key: "sqlserver",
    name: "MS SQL",
    plugin: msSqlSchema
  },
];
