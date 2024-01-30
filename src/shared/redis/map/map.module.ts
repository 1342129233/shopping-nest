import { Module } from '@nestjs/common';
import { MapController } from './map.controller';
import { RedisModule } from '../redisModule/redis.module';

@Module({
    imports: [RedisModule],
    controllers: [MapController],
    providers: []
})
export class MapModule {

}

