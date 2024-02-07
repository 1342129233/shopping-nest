import { Controller, Get, Post, Query, UploadedFile, UseInterceptors, ParseIntPipe, BadRequestException, Response } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as sharp from 'sharp'
import { UploadService } from './upload.service';

@Controller('special')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Get('hello')
    findAll() {
        return this.uploadService.getHello();
    }

    // 保存地址,提取 file 参数的内容,保存到 dest 目录下
    @Post('update')
    @UseInterceptors(FileInterceptor('file', {
        dest: 'src/common/images' // 保存的地址
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        // 文件路径返
        return file.path;
    }
 
    // 压缩/直接下载
    @Get('compression')
    async compression(
        @Query('path') filePath: string, // 文件路径
        @Query('color', ParseIntPipe) color:number, // 颜色数量
        @Query('level', ParseIntPipe) level: number, // 压缩级别
        @Response() res
    ) {
        
        if(!fs.existsSync(filePath)) {
            throw new BadRequestException('文件不存在');
        }
        const data = await sharp(filePath, {
            animated: true,
            limitInputPixels: false
        }).gif({
            colours: color,
            dither: level
        }).toBuffer();

        res.set('Content-Disposition', `attachment; filename="dest.gif"`);

        return res.send(data);
    }
}

