import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '../redisModule/redis.service';

@Injectable()
export class SessionService {
    @Inject(RedisService)
    private readonly redisService: RedisService;

    async setSession(
        sid: string,
        value: Record<string, any>,
        ttl: number = 30 * 60
    ) {
        if(!sid) {
            sid = this.generateSid()
        }
        await this.redisService.hashSet(`sid_${sid}`, value, ttl);
    }

    // 从redis中取值
    async getSession<SessionType extends Record<string, any>>(sid: string):Promise<SessionType>;
    async getSession(sid: string) {
        return await this.redisService.hashGet(`sid_${sid}`);
    }

    // 生成的随机的 session id
    generateSid() {
        return Math.random().toString().slice(2, 12);
    }
}

