import { Module } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import "reflect-metadata";
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeModule } from 'src/mobile/view/home/home.module';
import { CategoryModule } from 'src/mobile/view/category/category.module';
import { UserModule } from 'src/mobile/view/user/user.module';
import User from '@/typeorm/mysql/user';


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "127.0.0.1",
            port: 3306,
            username: "root",
            password: "123456",
            database: "my_user",
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