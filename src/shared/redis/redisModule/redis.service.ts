import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
    @Inject('REDIS_CLIENT')
    private redisClient: RedisClientType;

    // 分布式 session 
    // 开始
    async hashGet(key: string) {
        return await this.redisClient.hGetAll(key);
    }

    async hashSet(key: string, obj: Record<string, any>, ttl?: number) {
        for(const name in obj) {
            await this.redisClient.hSet(key, name, obj[name]);
        }
        if(ttl) {
            await this.redisClient.expire(key, ttl);
        }
    }
    // 结束

    // 地图定位
    // 开始
    // redis中封装一些方法 这里用来存储坐标的位置
    async geoAdd(
        key: string,
        posName: string,
        posLoc: [number, number]
    ) {
        // geoAdd 来存储地理位置
        // key：Redis 数据库中的键，用于存储地理空间位置。
        // longitude：地理空间位置的经度。
        // latitude：地理空间位置的纬度。
        // member：地理空间位置的名称，可以是任何字符串。
        return await this.redisClient.geoAdd(key, {
            longitude: posLoc[0],
            latitude: posLoc[1],
            member: posName
        })
    }

    // 获取位置信息
    async geoPos(key: string, posName: string) {
        const res = await this.redisClient.geoPos(key, posName);

        return {
            name: posName,
            longitude: res[0].longitude,
            latitude: res[0].latitude
        }
    }

    // 获取列表信息
    async geoList(key: string) {
        // geo的底层使用的是 zset来存储的 0 -1就是获取所有的
        const positions = await this.redisClient.zRange(key, 0, -1);

        const list = [];
        for(let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            const res = await this.geoPos(key, pos);
            list.push(res);
        }
        return list;
    }

    // 获取附近的信息
    async geoSearch(
        key: string, 
        pos: [number, number], 
        radius: number
    ) {
        const positions = await this.redisClient.geoRadius(
            key,
            {
                longitude: pos[0],
                latitude: pos[1],
            },
            radius,
            'km'
        );

        const list = [];
        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            const res = await this.geoPos(key, pos);
            list.push(res);
        }

        return list;
    }

    // 封装一系列的redis操作的方法

    // 新增
    async zAdd(key: string, members: Record<string, number>) {
        const mems = [];
        for(const key in members) {
            mems.push({
                value: key,
                score: members[key]
            })
        }
        return await this.redisClient.zAdd(key, mems);
    }

    // 获取分数
    async zScore(key: string, member: string) {
        return await this.redisClient.zScore(key, member);
    }

    // 排名
    async zRank(key: string, member: string) {
        return await this.redisClient.zRank(key, member);
    }

    // 增量增加
    async zIncr(key: string, member: string, increment: number) {
        return await this.redisClient.zIncrBy(key, increment, member);
    }

    async zRankingList(key: string, start: number = 0, end: number = -1) {
        const keys = await this.redisClient.zRange(key, start, end, {
            REV: true,
        })
        const rankingList = {};
        for(let i = 0; i < keys.length; i++) {
            rankingList[keys[i]] = await this.zScore(key, keys[i]);
        }
        return rankingList;
    }

    // 联合
    async zUnion(newKey: string, keys: string[]) {
        if(!keys.length) {
            return [];
        }
        if(keys.length === 1) {
            return this.zRankingList(keys[0]);
        }

        await this.redisClient.zUnionStore(newKey, keys);

        return this.zRankingList(newKey);
    }

    // 获取 keys, keys 这是一个危险的操作,请谨慎操作
    async keys(pattern: string) {
        // keys 命令可能会被禁用,这里可以使用 scan 命令来代替
        return this.redisClient.keys(pattern);
    }
}


// https://redis.io/docs/data-types/geospatial/
// 常见命令:
// https://redis.io/commands/geoadd/ 可以找到具体的命令


// 高德地图
// https://console.amap.com/dev/key/app
// 创建新的应用 获取key值

// 添加几个坐标信息
// http://localhost:3000/addPos?name=天安门&longitude=116.397444&latitude=39.909183

// http://localhost:3000/addPos?name=文化宫科技馆&longitude=116.3993&latitude=39.908578

// http://localhost:3000/addPos?name=售票处&longitude=116.397283&latitude=39.90943

// http://localhost:3000/addPos?name=故宫彩扩部&longitude=116.398002&latitude=39.909175

// search
// http://localhost:3000/nearbySearch?longitude=116.397444&latitude=39.909183&radius=0.04
