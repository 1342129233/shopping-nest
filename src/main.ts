import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true // 支持跨域请求
    });
    // app.useGlobalGuards(new RolesGuard()); // 可以设置全局守卫
    await app.listen(3000);
}

bootstrap();
