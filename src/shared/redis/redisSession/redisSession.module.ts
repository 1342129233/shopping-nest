import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisSessionService } from './redisSession.service';

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [
        RedisSessionService,
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
    exports: [RedisSessionService],
})
export class RedisModule { }
