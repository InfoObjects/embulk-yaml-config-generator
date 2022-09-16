import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import * as yaml from 'js-yaml';

class CustomTag {
  data: any;
  type: any;
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  beforeParseDig(str: any, isDump?: boolean): any {
    str = str.replaceAll('!include', '__NOT__include');
    str = str.replaceAll('[', '__SBRK__');
    str = str.replaceAll(']', '__EBRK__');
    if (!isDump) {
      str = str.replaceAll('"', '__SQOT__');
    }
    str = str.replaceAll("'", '__SQOT__');
    let matches = [...str.matchAll('__SQOT__(.*)__SQOT__')];
    matches.forEach((match) => {
      console.log('match found at ' + match.index, match[0]);
      str = str.replaceAll(match[0], match[0].replaceAll(' ', '__SP__'));
    });
    return str;
  }

  afterParseDig(str: any): any {
    str = str.replaceAll('__NOT__include', '!include');
    str = str.replaceAll('__SBRK__', '[');
    str = str.replaceAll('__EBRK__', ']');
    str = str.replaceAll('__SQOT__', "'");
    str = str.replaceAll('__SP__', ' ');
    return str;
  }

  afterDumpYaml(str: any): any {
    str = str.replaceAll(`'''`, `'`);
    str = str.replaceAll(`: |`, `:`);
    return str;
  }

  parseDig(request: any): any {
    let parse = request.yaml;

    if (parse) {
      parse = this.beforeParseDig(parse);
      //return parse;
      try {
        const data = yaml.load(parse);
        const DataString = this.afterParseDig(JSON.stringify(data));
        return JSON.parse(DataString);
      } catch (e) {
        console.log(e);
        return e;
      }
    } else {
      return { in: null, out: null };
    }
  }

  parseYaml(request: any): any {
    let parse = request.yaml;

    if (parse) {
      try {
        let data = yaml.load(parse);
        return {
          data: data,
          error: false,
          message: 'Success',
        };
      } catch (e) {
        //console.log(e);
        return {
          data: e,
          error: true,
          message: 'badResponse',
        };
      }
    } else {
      return {
        data: null,
        error: true,
        message: 'invalid yaml format',
      };
    }

    /* try {
      let fileContents = readFileSync('./upload/test1.yml', 'utf8');
      let data = yaml.load(fileContents);
      return data;
    } catch (e) {
      console.log(e);
    } */
  }

  writeYaml(request: any): any {
    const replacer = (key: any, value: any) => {
      if (typeof value === 'string') {
        if (value === 'true') {
          value = true;
        } else if (value === 'false') {
          value = false;
        } else if (value.indexOf(' ') >= 0) {
          value = `'${value}'`;
        }
      }
      if (
        key === 'column_options' ||
        key === 'default_column_options' ||
        key === 'decoders' ||
        key === 'columns' ||
        key === 'add_columns' ||
        key === 'new_columns' ||
        key == 'mappingColumn_Value'||
        key === 'drop_columns'
      ) {
        value = yaml.dump(value, { lineWidth: -1, flowLevel: 1, replacer });
      }
      return value;
    };
    try {
      let parse = JSON.parse(request.yaml);
      let yamlStr = yaml.dump(parse, {
        lineWidth: -1,
        replacer,
      });
      yamlStr = this.afterDumpYaml(yamlStr);
      //writeFileSync('./upload/data-out.yml', yamlStr, 'utf8');
      return {
        error: false,
        data: yamlStr,
        message: 'Success',
      };
    } catch {
      return {
        error: true,
        data: null,
        message: 'Bad Response',
      };
    }
  }

  writeDig(request: any): any {
    let parse = JSON.parse(this.beforeParseDig(request.yaml, true));
    let yamlStr = yaml.dump(parse, {
      lineWidth: -1,
    });
    yamlStr = this.afterParseDig(yamlStr);
    writeFileSync('./upload/data-out.dig', yamlStr, 'utf8');
    return yamlStr;
  }

  deployEmbulkFile(request: any): any {
    const { yaml, fileName } = request;
    let response = {
      data: null,
      error: false,
      message: '',
    };
    if (yaml && fileName) {
      try {
        writeFileSync(`./upload/${fileName}.yml`, yaml, 'utf8');
        response.message = 'Success';
      } catch (error) {
        response = {
          data: error,
          error: true,
          message: 'badResponse',
        };
      }
    } else {
      response.error = true;
      if (!fileName && !yaml) {
        response.message = 'required file name and yaml';
      } else if (!fileName) {
        response.message = 'required file name';
      } else {
        response.message = 'required yaml';
      }
    }
    return response;
  }
}
