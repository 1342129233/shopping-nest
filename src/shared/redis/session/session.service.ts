import { Inject, Injectable } from '@nestjs/common';
import { RedisSessionService } from '../redisSession/redisSession.service';

@Injectable()
export class SessionService {
    @Inject(RedisSessionService)
    private readonly redisSessionService: RedisSessionService;

    async setSession(
        sid: string,
        value: Record<string, any>,
        ttl: number = 30 * 60
    ) {
        if(!sid) {
            sid = this.generateSid()
        }
        await this.redisSessionService.hashSet(`sid_${sid}`, value, ttl);
    }

    // 从redis中取值
    async getSession<SessionType extends Record<string, any>>(sid: string):Promise<SessionType>;
    async getSession(sid: string) {
        return await this.redisSessionService.hashGet(`sid_${sid}`);
    }

    // 生成的随机的 session id
    generateSid() {
        return Math.random().toString().slice(2, 12);
    }
}

