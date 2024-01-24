import { Module, UsePipes } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import "reflect-metadata";
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeModule } from '@/mobile/view/home/home.module';
import { CategoryModule } from '@/mobile/view/category/category.module';
import { UserModule } from '@/mobile/view/user/user.module';
import { AuthModule } from '@/mobile/view/auth/auth.module';
import { SwaggerModule } from '@/mobile/view/swagger/swagger.module';
import { UserRolesAccessModule } from '@/mobile/view/userRolesAccess/userRolesAccess.module';

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
        HomeModule,
        CategoryModule,
        UserModule,
        AuthModule,
        SwaggerModule,
        UserRolesAccessModule
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
