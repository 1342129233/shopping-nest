import { Injectable } from '@nestjs/common';
import { RedisService, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

// 通过服务来获取 redis 实例，默认从 DEFAULT_REDIS_NAMESPACE 下获取(另一种是通过装饰器)
@Injectable()
export class AppService {
    private readonly redis: Redis;

    constructor(private readonly redisService: RedisService) {
        this.redis = this.redisService.getClient();
        // or
        // this.redis = this.redisService.getClient(DEFAULT_REDIS_NAMESPACE);
    }
    
    // 查看所有的 redis 储存
    async set() {
        const client = this.redisService.getClient();
        const keys = await client.keys('*');
        const result = {};
        for(const key of keys) {
            const value = await client.get(key);
            result[key] = value;
        }
        return result;
    }
}