import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { JwtAuthGuard } from '@/shared/JwtStrategy/jwt.auth.guard';
import { options } from '@/shared/JwtStrategy/config';
import { JwtService } from '@nestjs/jwt';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: true // 支持跨域请求
    });
    app.use(cookieParser()); // 添加 cookie-parser 中间件
    const jwtService = new JwtService(options);
    app.useGlobalGuards(new JwtAuthGuard(jwtService)); // 可以设置全局守卫
    // app.useGlobalPipes(new ValidationPipe()); // 全局验证

    // 配置api文档信息
    const documentOptions = new DocumentBuilder()
        .setTitle('nest framework  api文档')
        .setDescription('nest framework  api文档')
        // .setBasePath('/') // 设置基础的路径
        // .addBearerAuth({ type: 'apiKey', in: 'header', name: 'token' }) // 设置请求头的token字段增加登陆保护
        .addTag('Api/V1')
        .setVersion('0.0.1')
        .build();
    const document = SwaggerModule.createDocument(app, documentOptions);
    SwaggerModule.setup(`/docs`, app, document); // 地址 http://localhost:3000/docs 全部接口文档

    app.enableCors(); // 允许跨域请求

    app.useStaticAssets('static', { prefix: '/pages' })

    await app.listen(3000);
}

bootstrap();
