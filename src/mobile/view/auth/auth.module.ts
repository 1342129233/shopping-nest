import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/typeorm/mysql/user';

@Module({
    imports: [
        JwtModule.registerAsync({
            async useFactory() {
                return {
                    secret: 'water',
                    signOptions: {
                        expiresIn: '7d'
                    }
                }
            }
        }),
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}

