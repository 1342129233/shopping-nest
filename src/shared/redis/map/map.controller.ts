import { 
    Controller,
    Inject,
    Get,
    Query,
    BadRequestException
} from '@nestjs/common';
import { RedisService } from '../redisModule/redis.service';

@Controller()
export class MapController {

    @Inject(RedisService)
    private redisService: RedisService

    // 存储位置信息
    @Get('addPos')
    async addPos(
        @Query('name') posName: string,
        @Query('longitude') longitude: number,
        @Query('latitude') latitude: number
    ) {
        if (!posName || !longitude || !latitude) {
            throw new BadRequestException('位置信息不全');
        }

        try {
            await this.redisService.geoAdd('positions', posName, [
                longitude,
                latitude
            ])
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    // 获得列表展示
    @Get('allPos')
    async allPos() {
        return this.redisService.geoList('positions');
    }

    // 获取指定的具体信息
    @Get('pos')
    async pos(@Query('name') name: string) {
        return this.redisService.geoPos('positions', name);
    }

    // 获取坐标: https://lbs.amap.com/tools/picker
    @Get('nearbySearch')
    async nearbySearch(
        @Query('longitude') longitude: number,
        @Query('latitude') latitude: number,
        @Query('radius') radius: number, // 指定半径内的
    ) {
        if (!longitude || !latitude) {
            throw new BadRequestException('缺少位置信息');
        }

        if (!radius) {
            throw new BadRequestException('缺少搜索半径');
        }

        return this.redisService.geoSearch(
            'positions',
            [longitude, latitude],
            radius
        )
    }
}


