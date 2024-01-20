import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/typeorm/mysql/user';
import { options } from '@/shared/JwtStrategy/config';

@Module({
    imports: [
        JwtModule.registerAsync({
            async useFactory() {
                return options;
            }
        }),
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}

