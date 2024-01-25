import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class DefaultService {
    @Inject('REDIS_CLIENT') // 需要将REDIS_CLIENT注入到redisClient属性中
    private redisClient: RedisClientType; // 私有属性redisClient

    async getHello(): Promise<string> {
        const value = await this.redisClient.keys('*'); // 获取Redis数据库中所有的键
        return `Hello World! ${value}`;
    }
}
