import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

//@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  "@get/getHello"() {
    //return this.appService.getHello
    return this.appService.getHello();
  }
}


