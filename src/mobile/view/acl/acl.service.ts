import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { AclDto } from './acl.dto';
import { User } from '@/typeorm/mysql/user.entity';
// https://github.com/liaoliaots/nestjs-redis/blob/HEAD/docs/latest/redis.md 使用方式

@Injectable()
export class AclService {
    constructor(
        // 通过装饰器：
        @InjectRedis() private readonly redis: Redis, // or // @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ){}     // 其他权限控制逻辑

    // 获取全部 redis 储存参数
    async getAllRedis() {
        const keys = await this.redis.keys('*');
        const result = {};
        for (const key of keys) {
            result[key] = await this.redis.get(key);
        }
        return result;
    }

    // 将用户的权限信息存储在redis中
    async setPermission(body: AclDto): Promise<any>{
        const user = await this.userRepository.findOne({ where: { username: body.userName } });

        if(user) {
            await this.redis.set(user.username, user.password, 'EX', 100);
            const userRedis = await this.getCheckPermission(user.username);
            return {
                key: user.username,
                value: userRedis
            };
        } else {
            return {
                msg: '用户不存在'
            }
        }
    }

    // 查看
    async getCheckPermission(userId: string){
        return await this.redis.get(userId);
    }

    // 更新 如果键不存在，会抛出一个NotFoundException
    async putPermission(userId: string): Promise<void> {
        const exists = await this.redis.exists(userId);
        if (exists === 0) {
            throw new NotFoundException(`Key ${userId} does not exist`);
        }
        await this.redis.set(userId, '666', 'EX', 100);

    }

    // 删除
    async delPermission(userId: string): Promise<void> {
        const exists = await this.redis.exists(userId);
        if (exists === 0) {
            throw new NotFoundException(`Key ${userId} does not exist`);
        }
        await this.redis.del(userId)
    }
}