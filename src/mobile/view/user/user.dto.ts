import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
    @IsNotEmpty({ message: '用户名不能为空' })
    @IsString({ message: '用户名必须为字符串类型' })
    username: string;
    @IsNotEmpty({ message: '密码不能为空' })
    @IsString({ message: '密码必须为字符串类型' })
    password: string;
    is_del: number;
}

export class UserExtendDto {
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

export class UserAndPostsDto {
    @IsNotEmpty({ message: '用户名不能为空' })
    @IsString({ message: '用户名必须为字符串类型' })
    username: string;
    @IsNotEmpty({ message: '密码不能为空' })
    @IsString({ message: '密码必须为字符串类型' })
    password: string;
    is_del: number;
    posts: {
        title: string;
        content: string
    }[]
}
