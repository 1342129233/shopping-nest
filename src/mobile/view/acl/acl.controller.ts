import { Controller, Get, Post, Body, Put, Delete, UsePipes, BadRequestException, UseGuards, Request, Response, Query, Param } from '@nestjs/common'
import { ValidationPipe } from '@nestjs/common';
import { AclService } from './acl.service';
import { AclDto } from './acl.dto';

@Controller('resource')
export class AclController {
    constructor(private readonly aclService: AclService){}

    @Get('allredis')
    allRedis() {
        return this.aclService.getAllRedis();
    }   

    @Post('acl')
    @UsePipes(
        new ValidationPipe({
            transform: true, // 转化对象为类的实例
            validateCustomDecorators: true, // 验证那些使用自定义装饰器的属性
            whitelist: true, // 只验证被装饰器装饰的属性
            stopAtFirstError: true, // 遇到第一个错误时停止验证
            forbidNonWhitelisted: true, // 如果对象有未被装饰器装饰的属性，立即抛出错误
            // skipMissingProperties: true, // 忽略不存在的属性
            exceptionFactory: errors => {
                console.log(errors);
                const firstError = errors[0];
                const message = `${firstError.property}的值为${firstError.value}, ${Object.values(firstError.constraints).join(', ')}`;
                return new BadRequestException(message); // 将错误以BadRequestException的形式抛出
            }
        })
    )
    async setResource(@Body() aclDto: AclDto) {
        const user = await this.aclService.setPermission(aclDto);
        return user;
    }

    @Get('redisAcl')
    @UsePipes(new ValidationPipe({ stopAtFirstError: true,  })) // 遇到第一个错误时停止验证
    async getRedisAcl(@Query() params: AclDto) {
        const user = await this.aclService.getCheckPermission(params.userName);
        return {
            data: user
        };
    }

    @Put('redisAclUpdate')
    @UsePipes(new ValidationPipe({ transform: true, stopAtFirstError: true }))
    async putRedisAcl(@Body() aclDto: AclDto) {
        await this.aclService.putPermission(aclDto.userName);
        const user = await this.aclService.getCheckPermission(aclDto.userName);
        return {
            data: user
        };
    }

    @Delete('redisAclDel')
    @UsePipes(new ValidationPipe({ transform: true, stopAtFirstError: true }))
    async delRedisAcl(@Body() aclDto: AclDto) {
        await this.aclService.delPermission(aclDto.userName);
        const user = await this.aclService.getCheckPermission(aclDto.userName);
        return {
            data: user
        };
    }
}
