import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class AppService implements OnApplicationBootstrap {
    constructor(
        private readonly schedulerRegistry: SchedulerRegistry
    ){}

    onApplicationBootstrap(): any {
        console.log('执行了 onApplicationBootstrap 方法');
    }

    getHello(): string {
        return 'Hello World!';
    }

    // 第一种方式 CronJob
    onApplicationBootstrap1() {
        const yourJob: any = new CronJob('* * * * * *', () => {
            console.log('This runs every second.');
        })

        this.schedulerRegistry.addCronJob('myJobName', yourJob);
        yourJob.start();
    }

    // 第二种方式 Interval
    onApplicationBootstrap2() {
        const intervalDuration = 5000; // 5 seconds
        const yourJob = setInterval(() => {
            console.log('This runs every 5 seconds.');
        }, intervalDuration);

        this.schedulerRegistry.addInterval('myJobName', yourJob);
    }

    // 第三种 Timeout
    onApplicationBootstrap3() {
        const timeoutDuration = 3000; // 3 seconds
        const yourJob = setTimeout(() => {
        console.log('This runs after 3 seconds.');
        }, timeoutDuration);

        this.schedulerRegistry.addTimeout('myJobName', yourJob);
    }
}