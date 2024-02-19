import { Controller, Get, Post, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { getExcel } from '@/shared/excel/getExcel';
import { setExcel } from '@/shared/excel/setExcel';
import { join } from 'path';
import { readFile } from 'fs/promises';

// special/
@Controller('special/excel')
export class ExcelController {
    constructor() {}

    // 获取excel模板
    @Post('template')
    @UseInterceptors(FileInterceptor('file', {
        dest: 'src/common/excel' // 保存的地址
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res) {
        // 文件路径
        console.log(file.path);
        // 读取文件
        const row = await getExcel(file)
        // 写入文件
        await setExcel(row)
        
        res.send('ok')
    }

    // 下载
    @Get('download')
    async downloadFile(@Res() res) {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
        const configFilePath = join(process.cwd(), `src/common/excel/data.xlsx`);
        const fileStream = await readFile(configFilePath);
        res.send(fileStream);
    }
}
