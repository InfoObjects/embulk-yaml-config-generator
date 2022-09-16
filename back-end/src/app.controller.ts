import { Controller, Get, Post, Body, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('read-yaml')
  @UseInterceptors(FileInterceptor('file'))
  readYaml(@Body() req: any): any {
    return this.appService.parseYaml(req);
  }

  @Post('read-dig')
  @UseInterceptors(FileInterceptor('file'))
  readDig(@Body() req: any): any {
    return this.appService.parseDig(req);
  }

  @Post('save-yaml')
  @UseInterceptors(FileInterceptor('file'))
  saveYaml(@Body() req: any): any {
    return this.appService.writeYaml(req);
  }

  @Post('save-dig')
  @UseInterceptors(FileInterceptor('file'))
  saveDig(@Body() req: any): any {
    return this.appService.writeDig(req);
  }

  @Post('deploy-embulk')
  @UseInterceptors(FileInterceptor('file'))
  deployEmbulk(@Body() req: any): any {
    return this.appService.deployEmbulkFile(req);
  }
}
