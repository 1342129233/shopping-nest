import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TaskServiceValue {

    // @Cron('45 * * * * *')
    // handleCron() {
    //   this.logger.debug('Called when the current second is 45');
    // }

    // 使用 corn声明任务执行的时间 CronExpression.EVERY_5_SECONDS = "*/5 * * * * *"
    @Cron(CronExpression.EVERY_5_SECONDS, {
        // 第二个参数
        name: 'task1',
        timeZone: 'Asia/shanghai',
    })
    handleCron() {
        console.log('task execute', this.findAll());
    }

    findAll() {
        return 'This action returns all task';
    }

    // 还可以使用 @interval指定任务的执行间隔 参数是毫秒
    @Interval('task2', 500)
    task2() {
        console.log('task2');
    }

    // 还可以使用 timeout 指定多长时候后执行
    @Timeout('task3', 3000)
    task3() {
        console.log('task3');
    }
}
