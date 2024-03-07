// 查询日志 定位问题
// 日志 => 数分 => 指标 => 业务分析 => 监控报警

import { DynamicModule, Global, Module } from '@nestjs/common';
import { MyLogger } from './MyLogger';
import { LoggerOptions } from 'winston';
export const WINSTON_LOGGER_TOKEN = 'WINSTON_LOGGER';

@Global()
@Module({})
export class WinstonModule {
    public static forRoot(options?: LoggerOptions): DynamicModule {
        return {
            module: WinstonModule,
            providers: [
                {
                    provide: WINSTON_LOGGER_TOKEN,
                    useValue: new MyLogger(options),
                }
            ],
            exports: [WINSTON_LOGGER_TOKEN]
        }
    }
}






