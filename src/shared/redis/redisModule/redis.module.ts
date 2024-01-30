import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [
        RedisService,
        {
            provide: 'REDIS_CLIENT',
            async useFactory() {
                const client = createClient({
                    // socket: {
                    //     host: 'localhost',
                    //     port: 6379,
                    // },
                    // password: 'admin123',
                });
                await client.connect();
                return client;
            },
        },
    ],
    exports: [RedisService],
})
export class RedisModule { }
