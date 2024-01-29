import { IsNotEmpty, IsString } from 'class-validator';

export class AclDto {
    @IsString({ message: '用户名必须是字符串类型' })
    @IsNotEmpty({ message: '用户名不能为空' })
    userName: string;
}
