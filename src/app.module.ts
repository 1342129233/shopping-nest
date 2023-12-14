import { Module } from '@nestjs/common';
import { HomeModule } from 'src/mobile/view/home/home.module';

@Module({
    imports: [
        HomeModule
    ],
    controllers: [],
    providers: []
})

export class AppModule {}