import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, EntityManager, QueryRunner, MoreThanOrEqual } from 'typeorm';
import { User } from '@/typeorm/mysql/user';
import { JwtService } from '@nestjs/jwt';

export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, private readonly jwtService: JwtService) {}

    getHello() {
        return 'Hello';
    }
    
    async login(login) {
        const user = await this.userRepository.findOne({ where: { username: login.username, password: login.password } } as any);
        if(user) {
            const token = this.jwtService.sign({
                username: login.username,
                password: login.password
            })
            return token;
        }
        return null;
    }

    // 校验登录状态
    validateToken(token) {
        if (!token) {
            return false;
        }
        try {
            return this.jwtService.verify(token);
        } catch {
            return false;
        }
    }
}
