import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/typeorm/mysql/user.entity';
import { UserExtend } from '@/typeorm/mysql/userExtend.entity';
import { Tags } from '@/typeorm/mysql/tags.entity';
import { Posts } from '@/typeorm/mysql/posts.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserExtend, User, Tags, Posts])
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
