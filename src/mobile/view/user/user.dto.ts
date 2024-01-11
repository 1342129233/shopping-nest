import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: '用户名不能为空' })
    @IsString({ message: '用户名必须为字符串类型' })
    username: string;
    @IsNotEmpty({ message: '密码不能为空' })
    @IsString({ message: '密码必须为字符串类型' })
    password: string;
    is_del: number;
    phone: number;
    email: string;
    address: string;
}
