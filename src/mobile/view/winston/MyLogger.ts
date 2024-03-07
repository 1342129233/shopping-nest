import { LoggerService } from '@nestjs/common';
import { createLogger, format, transports, type Logger } from 'winston';
import * as chalk from 'chalk';
import * as dayjs from 'dayjs';
// import * as path from 'path';
import 'winston-daily-rotate-file';

// [Nest] 37340  - 2023/11/04 12:35:52     LOG [NestFactory] Starting Nest application...
export class MyLogger implements LoggerService {
  private logger: Logger; // LoggerService Logger

  constructor(options?) {
    this.logger = createLogger(
      options || {
        level: 'debug',
        // format: format.combine(format.colorize(), format.simple()),
        // transports: [new transports.Console()],
        transports: [
          new transports.Console({
            format: format.combine(
              format.colorize(),
              format.printf(({ context, level, message, time }) => {
                const appStr = chalk.green(`[NEST]`);
                const contextStr = chalk.yellow(`[${context}]`);
                return `${appStr} ${time} ${level} ${contextStr} ${message} `;
              }),
            ),
          }),
          // 分日期
          // 不同上下文分文件
          // new transports.File({
          //   format: format.combine(format.timestamp(), format.json()),
          //   filename: '111.log', // 不想固定文件名 不同的日志等级
          //   // resolve目录是dist
          //   // dirname: path.resolve(__dirname, 'logs'),
          //   dirname: 'logs',
          // }),
          new transports.DailyRotateFile({
            level: 'info',
            dirname: 'log2', // 文件夹
            filename: 'test-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            // maxSize: '1k',
          }),
          new transports.DailyRotateFile({
            level: 'error',
            dirname: 'log2',
            filename: 'test-error-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
          }),
        ],
      },
    );
  }
  log(message: string, context: string) {
    // console.log(`---log---[${context}]---`, message);
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('info', `${message}`, { context, time });
  }
  error(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    this.logger.error('error', message, { context, time });
    // console.log(`---error---[${context}]---`, message);
  }
  warn(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.warn('warn', message, { context, time });
    // console.log(`---warn---[${JSON.stringify(optionalParams)}]---`, message);
  }
}
