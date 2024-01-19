import { Module } from '@nestjs/common';

import "reflect-metadata";
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeModule } from '@/mobile/view/home/home.module';
import { CategoryModule } from '@/mobile/view/category/category.module';
import { UserModule } from '@/mobile/view/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.DB_HOST, // "127.0.0.1",
            port: +process.env.DB_PORT, // 3306,
            username: process.env.DB_USER, //"root",
            password: process.env.DB_PASSWORD, // "123456",
            database: process.env.DB_NAME, // "my_user",
            // host: "127.0.0.1",
            // port: 3306,
            // username: "root",
            // password: "123456",
            // database: "my_user",
            logging: true,
            synchronize: true,
            dropSchema: false,
            charset: "utf8mb4",
            timezone: "local",
            entities: [ // 定义TypeORM需要查找的数据模型的,可以定义多个
                __dirname + '/typeorm/mysql/*{.ts,.js}'
            ],
        }),
        HomeModule,
        CategoryModule,
        UserModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {
}
