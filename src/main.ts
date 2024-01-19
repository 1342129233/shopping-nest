import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true // 支持跨域请求
    });
    app.use(cookieParser()); // 添加 cookie-parser 中间件
    // app.useGlobalGuards(new RolesGuard()); // 可以设置全局守卫
    await app.listen(3000);
}

bootstrap();
