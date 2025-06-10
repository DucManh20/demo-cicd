import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { Request, Response } from 'express';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly loggerService = new LoggerService();
  catch(exception: unknown, host: ArgumentsHost) {
    this.loggerService.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(httpStatus).json({
      statusCode: +httpStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
