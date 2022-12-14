<p align="center">
  <a href="https://www.infoobjects.com/" target="blank"><img src="screenshots/logo.png" width="150" alt="InfoObjects Logo" /></a>
</p>
<p align="center">Infoobjects is a consulting company that helps enterprises transform how and where they run applications and infrastructure.
From strategy, to implementation, to ongoing managed services, Infoobjects creates tailored cloud solutions for enterprises at all stages of the cloud journey.</p>

## Embulk yaml config generator

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Embulk yaml config generator will help you to generate Embulk yaml code from UI. It has simple ui inertface where from you can choose plugin options(CSV, MySql, Postgres, Jdbc, sqlserver, etc) to genrate yaml code. This application has been built with NestJs(back-end) and NextJs(front-end).

## Preview

A fully functional demo is available, so feel free to play with it. See a [Live Demo](http://54.177.118.22:18079/).

<img src="screenshots/screenshot1.png" style=" width:100%; " />

## Quick start

back-end setup

```bash
cd back-end
npm install
npm run start
```
fornt-end setup
```bash
cd fornt-end
npm install
npm run dev
```

## Embulk configuration
Embulk uses a YAML file to define a bulk data loading configuration. Here is an example of the file:

A configuration file consists of following sections:

-  `exec`: Executor plugin options. An executor plugin control parallel processing (such as built-in thread executor)
-  `in`: Input plugin options. An input plugin is either record-based (MySQL, Oracle, etc) or file-based (S3, CSV, etc).
-  `filters`: Filter plugins options (optional).
-  `out`: Output plugin options. An output plugin is either record-based (Oracle, MySQL, etc) or file-based (CSV, Command, etc)

## Configured Plugins
In this application some plugins are configured so you can just use them after installation.

| in | out | filters |
| ------ | ------ | ------ |
| [csv](https://www.embulk.org/docs/built-in.html#csv-parser-plugin) | [csv](https://www.embulk.org/docs/built-in.html#csv-parser-plugin) | [columns](https://github.com/embulk/embulk-filter-column) |
| [mysql](https://github.com/embulk/embulk-input-jdbc/tree/master/embulk-input-mysql) | [mysql](https://github.com/embulk/embulk-output-jdbc/blob/master/embulk-output-mysql) | [add_columns](https://github.com/embulk/embulk-filter-column) |
| [postgresql](https://github.com/embulk/embulk-input-jdbc/tree/master/embulk-input-postgresql) | [postgresql](https://github.com/embulk/embulk-output-jdbc/blob/master/embulk-output-postgresql) | [add_time](https://github.com/treasure-data/embulk-filter-add_time) |
| [oracle](https://github.com/embulk/embulk-input-jdbc/blob/master/embulk-input-jdbc) | [oracle](https://github.com/embulk/embulk-output-jdbc/blob/master/embulk-output-jdbc) | [to_json](https://github.com/civitaspo/embulk-filter-to_json) |
| [mssql](https://github.com/embulk/embulk-input-jdbc/blob/master/embulk-input-sqlserver) | [mssql](https://github.com/embulk/embulk-output-jdbc/blob/master/embulk-output-sqlserver) | [remove_columns](https://www.embulk.org/docs/built-in.html#remove-columns-filter-plugin) |
| - | [send_email](https://github.com/InfoObjects/embulk-output-send_email) | [rename](https://www.embulk.org/docs/built-in.html#rename-filter-plugin) |
| - | stdout | [ruby_proc](https://github.com/joker1007/embulk-filter-ruby_proc) |
| - | - | [mysql_lookup](https://github.com/InfoObjects/embulk-filter-mysql_lookup) |
| - | - | [oracle_lookup](https://github.com/InfoObjects/embulk-filter-oracle_lookup) |
| - | - | [postgress_lookup](https://github.com/InfoObjects/embulk-filter-postgres_lookup) |
| - | - | [mssql_lookup](https://github.com/InfoObjects/embulk-filter-mssql_lookup) |
| - | - | [csv_lookup](https://github.com/InfoObjects/embulk-filter-csv_lookup) |

## Instructions to configure new field/plugin
Embulk plugin's default configurations are placed in file `front-end/utils/configSchema.ts`.
- `in & out - Plugins`: Ecah plugin is objects with 3 properties(common, input & output).
    - `input` : This is array of input plugin options.
    - `output`: This is array of output plugin options.
    - `common`: Some of configurations are same in input and output plugin, so this is  the array who has common plugin options and these options will be merge in both input & output plugin options.
- `filters - plugins`: There is a variable name as `filters` in file, here filter plugin options are available.

<img src="screenshots/filepath.png" />

### Add new plugin
In process to add a new plugin for `in` or `out`, create a new const variable in file `front-end/utils/configSchema.ts`.
```javascript
// schema start for in & out plugin
export const newPluginName = {
  common: [], // common options, these will use in both input & output
  input: [],  // array of input plugin options.
  output: []  // array of output plugin options.
}
// schema end for in & out plugin
```
After createing fields for `in`/`out` plugin within this new variable, we have to import this new variable into `front-end/utils/constants.ts` and add new plugin object into variable `embulkOptions`.
```javascript
import {
  newPluginName,
} from "./configSchema";

.....
.....

export const embulkOptions = [  
  .
  .
  {
    key: "pluginName",    // use into YAML output as plugin type.
    name: "Plugin Name",  // use to display on application UI.
    plugin: newPluginName // plugin is the object schema of fields.
  },
];
```
<img src="screenshots/screenshot4.png" style=" width:100%; " />

If you want too add new plugin into `filters` then you can simply add new plugin object into `filters` variable  in file `front-end/utils/configSchema.ts`.
```javascript
// schema start for filters plugin

export const filters = [ 
  .
  .
  {
    title: "ruby_proc", // plugin name, in YAML(- type: ruby_proc)
    type: "nested_without_title",
    required: false,
    options: [], // plugin fields object
  },
];
// schema end for filters plugin
```

### Basic Fields:
```javascript
{
  title: "driver_path",
  type: "text",
  defaultValue: "",
  required: true,
}
```
- `title`: This is plugin configuration title.
- `type`: It will define how this object will be used. Currently we supprot text, radio, textarea, array_of_strings, array_of_objects, nested, nested_without_title, multiple_key_value & multiple_key_objects.
- `defaultValue`: It is optional property, If we provide any value here then it will be used as initial value or pre-field value for this object. Currently it is supporting text, radio & textarea.
- `required`: When it is true, element will be visible & requird in UI, but if it is false then default it will be hidden and button will be there so user can choose if they want to use this property or not. 
- `options`: It is optional property. It should be either `array_of_string` or `array_of_object`. In case of `radio` type it will be an `array_of_string`. It cannot used with `text` or `textarea` type.
- `readOnly`: It is optional property. When it is `true` object will be freezed on UI.
- `hiddenWhen`: It is optional property. It will take another property title in value, for ex. `hiddenWhen: "table"` here this object will be hidden when `table` will be visible on UI. 
- `showWhen`: It is optional property. It will take another property title in value, for ex. `showWhen: "query"` here this object will be visible when `query` will be visible on UI.

### Type: 

- `text`: 
  ```javascript
  // js code
  {
    title: "driver_path",
    type: "text",
    defaultValue: "",
    required: false,
  }
  // yaml output
  driver_path: USER_INPUT_SOME_DATA
  ```

- `textarea`: 
  ```javascript
  // js code
  {
    title: "query",
    type: "textarea",
    required: true,
  }
  // yaml output
  query: USER_INPUT_SOME_DATA
  ```
- `radio`: 
  ```javascript
  // js code
  {
    title: "ssl",
    type: "radio",
    defaultValue: "false",
    options: ["true", "false"],
    required: false,
  }
  // yaml output
  ssl: false
  ```
- `array_of_strings`: 
  ```javascript
  // js code
  {
    title: "incremental_columns",
    type: "array_of_strings",
    required: false,
  }
  // yaml output
  incremental_columns:
    - USER_INPUT_SOME_DATA1
    - USER_INPUT_SOME_DATA2
  ```
- `array_of_objects`: 
  ```javascript
  // js code
  {
    title: "decoders",
    type: "array_of_objects",
    required: false,
    options: [
      {
        title: "type",
        type: "text",
        required: true,
      },
    ],
  }
  // yaml output
  decoders:
    - {type: USER_INPUT_SOME_DATA1}
    - {type: USER_INPUT_SOME_DATA2}
  ```
- `nested`: 
  ```javascript
  // js code
  {
    title: "from_column",
    type: "nested",
    required: false,
    options: [
      {
        title: "name",
        type: "text",
        required: true,
      },
      {
        title: "unix_timestamp_unit",
        type: "text",
        required: true,
      },
      {
        title: "timestamp_format",
        type: "text",
        required: true,
      },
    ],
  }
  // yaml output
  from_column:
    name: USER_INPUT_SOME_DATA1
    unix_timestamp_unit: USER_INPUT_SOME_DATA2
    timestamp_format: USER_INPUT_SOME_DATA3
  ```
- `nested_without_title`: 
  ```javascript
  // js code
  {
    title: "add_columns",
    type: "nested_without_title",
    required: false,
    options: [
      {
        title: "type",
        type: "text",
        defaultValue: "column",
        readOnly: true,
        required: true,
      },
      {
        title: "add_columns",
        type: "array_of_objects",
        required: false,
        options: [
          {
            title: "name",
            type: "text",
            required: true,
          },
        ],
      },
    ],
  }
  // yaml output
  - type: column
    add_columns:
      - {name: USER_INPUT_SOME_DATA1}
  ```
- `multiple_key_value`: 
  ```javascript
  // js code
  {
    title: "options",
    type: "multiple_key_value",
    required: false,
    options: [
      {
        title: "key",
        type: "text",
        required: true,
      },
      {
        title: "value",
        type: "text",
        required: true,
      }
    ]
  }
  // yaml output
  options:
    USER_INPUT_KEY1: USER_INPUT_VALUE1
    USER_INPUT_KEY2: USER_INPUT_VALUE2
  ```
- `multiple_key_objects`: 
  ```javascript
  // js code
  {
    title: "column_options",
    type: "multiple_key_objects",
    required: false,
    options: [
      {
        title: "value_type",
        type: "text",
        required: false,
      },
      {
        title: "type",
        type: "text",
        required: false,
      },
      {
        title: "timestamp_format",
        type: "text",
        required: false,
      },
      {
        title: "timezone",
        type: "text",
        required: false,
      },
    ],
  }
  // yaml output
  column_options:
    key1: {value_type: USER_INPUT_VALUE1, type: USER_INPUT_VALUE2}
    key2: {timestamp_format: USER_INPUT_VALUE3, timezone: USER_INPUT_VALUE4}
    key3: {value_type: string, type: string}
    key4: {timestamp_format: '%Y-%m-%d %H:%M:%S', timezone: UTC}
  ```
## Back-end Configuration

Change default port number 
```javascript
//Goto file location /back-end/src/main.ts and find the line
await app.listen(3200); 
//in bootstrap function you can change nestJs port number from here.
```
whitelist url's 
```javascript
//There maybe CORS issue when you use server api on front-end app.
//Goto file location /back-end/src/main.ts and find the line 
const whitelist = ['http://localhost:3000', 'http://localhost:3200'];
//in bootstrap function, from here you update the domain name to avoid CORS issue.
```


## Front-end Configuration

Change default api endpoint 
```javascript
//Goto file location /front-end/utils/api.ts and find the line 
const endpoint = "http://localhost:3200/";
//and from here you can change api endpoint.
```
## Screenshots

<img src="screenshots/screenshot1.png" style=" width:100%; " />

<img src="screenshots/screenshot3.png" style=" width:100%; " />

<img src="screenshots/screenshot4.png" style=" width:100%; " />

<img src="screenshots/screenshot2.png" style=" width:100%; " />

## Useful Links

- [NestJs](https://nestjs.com)
- [NodeJs](https://nodejs.org)
- [NextJs](https://nextjs.org)
- [ReactJs](https://reactjs.org)
- [React Bootstrap](https://react-bootstrap.github.io)
- [Embulk](https://www.embulk.org)

## Licensing

InfoObjects [license](LICENSE) (MIT License)