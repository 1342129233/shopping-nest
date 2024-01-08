import { Module } from '@nestjs/common';
import { HomeModule } from 'src/mobile/view/home/home.module';
import { CategoryModule } from 'src/mobile/view/category/category.module';

@Module({
    imports: [
        HomeModule,
        CategoryModule
    ],
    controllers: [],
    providers: []
})

export class AppModule {}