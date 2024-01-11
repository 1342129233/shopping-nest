import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, EntityManager, QueryRunner, MoreThanOrEqual } from 'typeorm';
import { User } from '@/typeorm/mysql/user';
import { UserExtend } from '@/typeorm/mysql/userExtend';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        
        @InjectRepository(UserExtend)
        private readonly UserExtendRepository: Repository<User>,
        private readonly manager: EntityManager
    ){}

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        return await this.userRepository.findOne({ where: { id: id } } as any);
    }

    async create(user: User) {
        return await this.userRepository.save(user);
    }

    async userExtend(userExtend: UserExtend) {
        return await this.userRepository.save(userExtend);
    }
    
    async update(id: number, user: User): Promise<void> {
        await this.userRepository.update(id, user);
    }
    
    async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    // 一对一表关系
    async addTags(body: CreateUserDto) {
        // 先增副键然后关联主键
        const userExtend = new UserExtend();
        userExtend.phone = body.phone;
        userExtend.email = body.email;
        userExtend.address = body.address;

        // 先新增主键关联副键
        const user = new User(); 
        user.username = body.username;
        user.password = body.password;
        user.isDel = body.is_del || 0;

        // 关联两个数据模型
        user.userExtend = userExtend;

        // 首先保存主表数据
        const main = await this.manager.save(User, user);
        // 将外键赋值到副表数据中
        userExtend.userId = main.id;
        try {
            // 保存副表数据
            const sub = await this.manager.save(UserExtend, userExtend);
            return { main, sub };
        } catch (err) {
            // 如果保存副表数据失败，则事务回滚
            console.error(err);
            throw err;
        }
    }

    // 获取
    async getMainAndSub(id: number) {
        // // 获取主表数据
        // const main = await this.userRepository.findOne({ where: { id } } as any);
        // // 获取关联的表数据
        // const sub = await this.UserExtendRepository.findOne({ where: { userId: id } } as any);

        // 第二种查找方式 正向查找 且找到关联数据
        // const userRepository = this.manager.getRepository(User);
        // const result = await userRepository.find({ relations: ['userExtend'] })

        // 第三种查找方式 反向查找 且找到关联数据
        const userExtendRepository = this.manager.getRepository(UserExtend);
        const result = await userExtendRepository.find({ relations: ['user'] });

        // 查询ID为11的用户信息
        // this.manager.getRepository(User).findOne({ where: { id: 11 } });
        // 所有ID大于等于11的用户信息
        this.manager.getRepository(User).find({ where: { id: MoreThanOrEqual(11) }});
        return {
            // ...main,
            // ...sub
            result
            
        }
    }
}
