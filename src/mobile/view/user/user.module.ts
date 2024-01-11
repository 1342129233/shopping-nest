import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/typeorm/mysql/user';
import { UserExtend } from '@/typeorm/mysql/userExtend';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserExtend, User])
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
