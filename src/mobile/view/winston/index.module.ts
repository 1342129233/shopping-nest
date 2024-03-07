import { Module } from '@nestjs/common';
import { AppController } from './index.controller';
import { AppService } from './index.service';
import { WinstonModule } from './winston.module';

@Module({
  imports: [WinstonModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
