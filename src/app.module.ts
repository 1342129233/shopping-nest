import { Module, UsePipes } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import "reflect-metadata";
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { HomeModule } from '@/mobile/view/home/home.module';
import { CategoryModule } from '@/mobile/view/category/category.module';
import { UserModule } from '@/mobile/view/user/user.module';
import { AuthModule } from '@/mobile/view/auth/auth.module';
import { SwaggerModule } from '@/mobile/view/swagger/swagger.module';
import { UserRolesAccessModule } from '@/mobile/view/userRolesAccess/userRolesAccess.module';
import { AclModule } from '@/mobile/view/acl/acl.module';
import { ShortLinkModule } from '@/mobile/view/short-link/short-link.module';
import { SseModule } from '@/mobile/view/sse/sse.module';
import { UploadModule } from '@/mobile/view/upload/upload.module';
import { QrcodeLoginModule } from '@/mobile/view/qrcode-login/qrcode-login.module';

// redis 配置
import { redisConfig } from '@/shared/redis/config';

// 拦截器
import { ResponseInterceptor } from '@/shared/interceptor/response.interceptor';

// 表
// import { User } from '@/typeorm/mysql/user.entity';
// import { AccessEntity } from '@/typeorm/mysql/access.entity';
// import { Posts } from '@/typeorm/mysql/posts.entity';
// import { RoleEntity } from '@/typeorm/mysql/role.entity';
// import { RoleAccess } from '@/typeorm/mysql/roleAccess.entity';
// import { Tags } from '@/typeorm/mysql/tags.entity';
// import { UserExtend } from '@/typeorm/mysql/userExtend.entity';
// import { UserRoles } from '@/typeorm/mysql/userRoles.entity';

// @UsePipes(new JwtAuthPipe())
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            // host: process.env.DB_HOST, // "127.0.0.1",
            // port: +process.env.DB_PORT, // 3306,
            // username: process.env.DB_USER, //"root",
            // password: process.env.DB_PASSWORD, // "123456",
            // database: process.env.DB_NAME, // "my_user",
            host: "127.0.0.1",
            port: 3306,
            username: "root",
            password: "123456",
            database: "my_user",
            logging: false,
            synchronize: true,
            dropSchema: false, // 每次应用启动时，TypeORM 都会删除所有的表和数据
            charset: "utf8mb4",
            timezone: "local",
            entities: [ // 定义TypeORM需要查找的数据模型的,可以定义多个
                __dirname + '/typeorm/mysql/*{.ts,.js}'
                // User,
                // Posts,
                // Tags,
                // UserExtend,
                // RoleAccess,
                // RoleEntity,
                // AccessEntity,
                // UserRoles
            ],
        }),
        RedisModule.forRoot({
            config: redisConfig
        }),
        // 异步配置
        // RedisModule.forRootAsync({
        //     imports: [ConfigModule],
        //     inject: [ConfigService],
        //     useFactory: async(configService: ConfigService): Promise<RedisModuleOptions> => {
        //         await somePromise();
        //         return {
        //             config: redisConfig
        //         }
        //     }
        // }),
        HomeModule,
        CategoryModule,
        UserModule,
        AuthModule,
        SwaggerModule,
        UserRolesAccessModule,
        AclModule,
        ShortLinkModule,
        SseModule,
        UploadModule,
        QrcodeLoginModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        }
    ]
})
export class AppModule {
}
