import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@/shared/redis/redisModule/redis.service';
import * as dayjs from 'dayjs';

@Injectable()
export class RankingService {
    @Inject(RedisService)
    redisService: RedisService;

    private getMonthKey() {
        const dateStr = dayjs().add(1, 'month').format('YYYY-MM');
        // const dateStr = dayjs().format('YYYY-MM');
        return `learning-ranking-month:${dateStr}`;
    }

    private getYearKey() {
        const dateStr = dayjs().format('YYYY');
        return `learning-ranking-year:${dateStr}`;
    }

    async join(name: string) {
        await this.redisService.zAdd(this.getMonthKey(), { [name]: 0 });
    }

    async addLearnTime(name: string, time: number) {
        // 增加学习时长
        await this.redisService.zIncr(this.getMonthKey(), name, time);
    }

    async getMonthRanking() {
        return this.redisService.zRankingList(this.getMonthKey(), 0, 10);
    }

    async getYearRanking() {
        const dateStr = dayjs().format('YYYY');
        const keys = await this.redisService.keys(`learning-ranking-month:${dateStr}-*`);

        return this.redisService.zUnion(this.getYearKey(), keys);
    }
}
