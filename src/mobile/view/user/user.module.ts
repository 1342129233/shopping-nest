import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/typeorm/mysql/user';
import { UserExtend } from '@/typeorm/mysql/userExtend';
import { Tags } from '@/typeorm/mysql/tags';
import { Posts } from '@/typeorm/mysql/posts';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserExtend, User, Tags, Posts])
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
