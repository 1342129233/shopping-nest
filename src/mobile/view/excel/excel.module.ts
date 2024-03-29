import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';

@Module({
    controllers: [ExcelController],
    providers: [ExcelService],
    exports: [ExcelService],
})
export class ExcelModule {}

