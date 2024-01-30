import { Module } from '@nestjs/common';
import { RedisSessionService } from '../redisSession/redisSession.service';

@Module({
    imports: [],
    controllers: [],
    providers: [RedisSessionService],
    exports: [RedisSessionService],
})
export class SessionModule {}


