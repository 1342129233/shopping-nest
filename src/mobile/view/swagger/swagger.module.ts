import { Module } from '@nestjs/common';
import { SwaggerController } from './swagger.controller';

@Module({
    imports: [],
    controllers: [SwaggerController],
    providers: [],
    exports: [],
})
export class SwaggerModule {

}
