import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    // 使用装饰器
    @ApiProperty({ required: true, description: '用户名' })
    @IsString({ message: '用户名必须为字符类型' })
    @IsNotEmpty({ message: '姓名不能为空' })
    readonly username: string;

    // 使用装饰器
    @ApiProperty({ required: true, description: '密码' })
    @IsString({ message: '密码必须为字符类型' })
    @IsNotEmpty({ message: '密码不能为空' })
    readonly password: string;
}
