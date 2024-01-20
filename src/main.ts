import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { JwtAuthGuard } from '@/shared/JwtStrategy/jwt.auth.guard';
import { options } from '@/shared/JwtStrategy/config';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true // 支持跨域请求
    });
    app.use(cookieParser()); // 添加 cookie-parser 中间件
    const jwtService = new JwtService(options);
    app.useGlobalGuards(new JwtAuthGuard(jwtService)); // 可以设置全局守卫
    await app.listen(3000);
}

bootstrap();
