import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! Demo CICD';
  }

  sayHi(): string {
    return 'Hi';
  }
}
