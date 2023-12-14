import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true // 支持跨域请求
    });
    await app.listen(3000);
}

bootstrap();
