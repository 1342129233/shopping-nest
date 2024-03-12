import { Controller, Get, Inject, Query } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller('ranking')
export class RankingController {
    @Inject(RankingController)
    rankingService: RankingService;

    // 排行榜
    @Get('monthRanking')
    async getMonthRanking() {
        return this.rankingService.getMonthRanking();
    }

    @Get('yearRanking')
    async getYearRanking() {
        return this.rankingService.getYearRanking();
    }

    // 学习就增加学习时长
    @Get('learn')
    async addLearnTime(@Query('name') name: string, @Query('time') time: string) {
        await this.rankingService.addLearnTime(name, parseFloat(time));
        return 'success';
    }

    // 加入学习
    @Get('join')
    async join(@Query('name') name: string) {
        await this.rankingService.join(name);
        return 'success';
    }
}
