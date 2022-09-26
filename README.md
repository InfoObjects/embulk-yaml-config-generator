<p align="center">
  <a href="https://www.infoobjects.com/" target="blank"><img src="screenshots/logo.png" width="150" alt="InfoObjects Logo" /></a>
</p>
<p align="center">Infoobjects is a consulting company that helps enterprises transform how and where they run applications and infrastructure.</p>
<p align="center">From strategy, to implementation, to ongoing managed services, Infoobjects creates tailored cloud solutions for enterprises at all stages of the cloud journey.</p>

## Embulk yaml config generator

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Embulk yaml config generator will help you to generate Embulk yaml code from UI. It has simple ui inertface where from you can choose plugin options(CSV, MySql, Postgres, Jdbc, sqlserver, etc) to genrate yaml code. This application has been built with NestJs(back-end) and NextJs(front-end).

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
Embulk uses a YAML file to define a bulk data loading. Here is an example of the file:

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
| - | sendEmail | [rename](https://www.embulk.org/docs/built-in.html#rename-filter-plugin) |
| - | stdout | [ruby_proc](https://github.com/joker1007/embulk-filter-ruby_proc) |
| - | - | [mysqllookup](#) |
| - | - | [oraclelookup](#) |
| - | - | [postgreslookup](#) |
| - | - | [LookUpFilter_SQL](#) |
| - | - | [LookUpCSV](#) |

## Instructions to configure new field/plugin
Embulk plugin's default configurations are placed in file `front-end/utils/configSchema.ts`.
- `in & out - Plugins`: Ecah plugin is objects with 3 properties(common, input & output).
    - `input` : This is array of input plugin options.
    - `output`: This is array of output plugin options.
    - `common`: Some of configurations are same in input and output plugin, so this is  the array who has common plugin options and these options will be merge in both input & output plugin options.
- `filters - plugins`: There is a variable name as `filters` in file, here filter plugin options are available.

Basic Fields:
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