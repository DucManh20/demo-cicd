import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './common/logger/logger.module';
import { UsersModule } from './module/users/users.module';

@Module({
  imports: [LoggerModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
