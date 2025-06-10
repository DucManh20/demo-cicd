import { Injectable, Logger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  log(message: string, context?: string) {
    super.log(message, context);
  }

  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
  }

  warn(message: string, context?: string) {
    super.warn(message, context);
  }

  debug(message: string, context?: any) {
    super.debug(message, context);
  }
}
