import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, EntityManager, QueryRunner, MoreThanOrEqual } from 'typeorm';
import { User } from '@/typeorm/mysql/user';

export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    getHello() {
        return 'Hello';
    }
    
    async login(login) {
        return await this.userRepository.findOne({ where: { username: login.username, password: login.password } } as any);
    }
}
