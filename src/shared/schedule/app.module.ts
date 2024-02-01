import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { TaskServiceValue } from './task.service';
import { CronJob } from 'cron';

@Module({
    imports: [ScheduleModule.forRoot()],
    controllers: [AppController],
    providers: [TaskServiceValue]
})
export class AppModule implements OnApplicationBootstrap {
    @Inject(SchedulerRegistry)
    private schedulerRegistry: SchedulerRegistry; // 装饰器 @Inject 注入 SchedulerRegistry 服务, 这个服务提供了一些方法来管理定时任务

    // 实现 OnApplicationBootstrap 接口的 onApplicationBootstrap 方法
    onApplicationBootstrap() {
        // 获取所有已经注册的 Cron 任务
        const jobs = this.schedulerRegistry.getCronJobs();

        // 遍历所有的 Cron 任务
        jobs.forEach((item, key) => {
            // 停止当前的 Cron 任务
            item.stop();
            // 从 SchedulerRegistry 中删除当前的 Cron 任务
            this.schedulerRegistry.deleteCronJob(key);
        });

        // 获取所有已经注册的 Interval 任务
        const intervals = this.schedulerRegistry.getIntervals();
        // 遍历所有的 Interval 任务
        intervals.forEach((item) => {
            // 获取当前的 Interval 任务
            const interval = this.schedulerRegistry.getInterval(item);
            // 清除当前的 Interval 任务
            clearInterval(interval);
            // 从 SchedulerRegistry 中删除当前的 Interval 任务
            this.schedulerRegistry.deleteInterval(item);
        });

        // 获取所有已经注册的 Timeout 任务
        const timeouts = this.schedulerRegistry.getTimeouts();
        // 遍历所有的 Timeout 任务
        timeouts.forEach((item) => {
            // 获取当前的 Timeout 任务
            const timeout = this.schedulerRegistry.getTimeout(item);
            // 清除当前的 Timeout 任务
            clearTimeout(timeout);
            // 从 SchedulerRegistry 中删除当前的 Timeout 任务
            this.schedulerRegistry.deleteTimeout(item);
        });

        // 删除之后在自己创建定时任务 npm install --save cron
        // 创建一个新的 Cron 任务，这个任务会每 5 秒执行一次 // `0/5 * * * * *`
        const job: any = new CronJob('*/5 * * * * *', () => {
            // 在 Cron 任务执行时打印一条消息
            console.log('cron job');
        });

        // 将新的 Cron 任务添加到 SchedulerRegistr
        this.schedulerRegistry.addCronJob('job1', job);
        // 启动新的 Cron 任务
        job.start();

        // 创建一个新的 Interval 任务，这个任务会每 3 秒执行一次
        const interval = setInterval(() => {
            console.log('interval job');
        }, 3000);
        // 将新的 Interval 任务添加到 SchedulerRegistry
        this.schedulerRegistry.addInterval('job2', interval);

        // 创建一个新的 Timeout 任务，这个任务会在 5 秒后执行
        const timeout = setTimeout(() => {
            console.log('timeout job');
        }, 5000);
        
        // 将新的 Timeout 任务添加到 SchedulerRegistry
        this.schedulerRegistry.addTimeout('job3', timeout);
    }
}
