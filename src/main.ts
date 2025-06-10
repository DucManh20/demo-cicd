import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionsFilter } from './common/exception/exception.filter';
import { format } from 'winston';
import { WinstonModule } from 'nest-winston';
import { transportsCustom } from './common/logger/winston.config';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: 'error',
      format: format.json(),
      transports: transportsCustom,
    }),
  });

  app.useGlobalFilters(new ExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
