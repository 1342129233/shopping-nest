import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, DataSource } from 'typeorm';
import User from '@/typeorm/mysql/user';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        return await this.userRepository.findOne({ where: { id: id } } as any);
    }

    async create(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }
    
    async update(id: number, user: User): Promise<void> {
        await this.userRepository.update(id, user);
    }
    
    async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
