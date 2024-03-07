import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './index.service';
import { Logger } from 'winston';
import { WINSTON_LOGGER_TOKEN } from './winston.module';

@Controller()
export class AppController {
    // private logger = new Logger();

    @Inject(WINSTON_LOGGER_TOKEN)
    private logger: Logger;
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        this.logger.log('hello world', AppController.name);
        // this.logger.error('something error happen', AppController.name);
        return this.appService.getHello();
    }
}
