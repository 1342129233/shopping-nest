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
