import { Controller, Get, Post, UseInterceptors, UploadedFile, Res, ParseFilePipe, Body, UploadedFiles, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { getExcel } from '@/shared/excel/getExcel';
import { setExcel } from '@/shared/excel/setExcel';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { ExcelService } from './excel.service';
import * as OSS from 'ali-oss';
import { storage } from './storage';
import { FileSizeValidationPipePipe } from './file-size-validation-pipe.pipe';


const client = new OSS({
    region: 'oss-cn-beijing',
    bucket: 'nest-upload-test',
    accessKeyid: 'LTAI5tHGVykmG2wyZrKxc8ed',
    accessKeySecret: 'd9mwkZ7lM1vSeRsrH7QXzHWjWLRXew'
})

// special/
@Controller('special/excel')
export class ExcelController {
    constructor() {}

    // 案例一: 自己上传一个 excel 文件
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

    // 案例二: 上传一个 excel 文件
    @Post('profile')
    @UseInterceptors(
        FileInterceptor('uploaded_file', {
            dest: 'src/common/excel', // 上传的目录文件
            // storage: // 可以指定存储 指定文件名 文件目录
        }),
    )
    async uploadSingleFile(
        // 文件拦截器 但是文件还是上传了
        // @UploadedFile(FileSizeValidationPipePipe) file: Express.Multer.File,
        @UploadedFile(
            new ParseFilePipe({
                // validators: [
                //     // 内置的
                //     new MaxFileSizeValidator({ maxSize: 1000 }),
                //     new FileTypeValidator({ fileType: 'image/jpeg' }),
                //     // 做扩展
                // ],
                // exceptionFatory: 
            })
        ) file: Express.Multer.File,
        @Body() body,
    ) {
        // console.log(file);
        // console.log(body);
        // return 'singleFile';
        const uploadResult = await client.put(file.originalname, file.path);
        // console.log('上传成功', uploadResult);
        // return 'upload-oss';
        return uploadResult.url;
    }

    // 多个文件上传 FilesInterceptor
    @Post('photos/upload')
    @UseInterceptors(
        // files 多个
        FilesInterceptor('photos', 2, {
            dest: 'uploads' // 上传的目录文件
        })
    )
    multipleFile(
        // files 多个
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() Body,
    ) {
        console.log(files);
        console.log(Body);
        return 'multipleFile';
    }

    // 案例三: 上传多个文件
    @Post('cool-profile')
    @UseInterceptors(
        // 多个
        FileFieldsInterceptor(
            [
                { name: 'acatar', maxCount: 1 },
                { name: 'gallery', maxCount: 3 }
            ],
            {
                // dest: 'my-uploads',
                storage: storage
            },
        ),
    )
    coolDemo(
        // files 多个
        // @UploadedFiles() files: Array<Express.Multer.File>,
        @UploadedFiles()
        files: { avatar?: Express.Multer.File[]; gallery?: Express.Multer.File[] },
        @Body() body,
    ) {
        console.log(files);
        console.log(body);
        return 'cool-profile';
    }
}
