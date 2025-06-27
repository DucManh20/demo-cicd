import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  health(): object {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('test')
  test(): object {
    return { status: ' test ok', timestamp: new Date().toISOString() };
  }

  @Get('test1')
  test1(): object {
    return { status: ' test ok', timestamp: new Date().toISOString() };
  }
}
