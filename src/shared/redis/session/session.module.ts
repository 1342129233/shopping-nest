import { Module } from '@nestjs/common';
import { RedisService } from '../redisModule/redis.service';

@Module({
    imports: [],
    controllers: [],
    providers: [RedisService],
    exports: [RedisService],
})
export class SessionModule {}


