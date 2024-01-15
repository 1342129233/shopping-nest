import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, EntityManager, QueryRunner, MoreThanOrEqual } from 'typeorm';
import { User } from '@/typeorm/mysql/user';
import { UserExtend } from '@/typeorm/mysql/userExtend';
import { Posts } from '@/typeorm/mysql/posts';
import { Tags } from '@/typeorm/mysql/tags';
import { UserExtendDto, UserAndPostsDto, UserAndPostsAndTagsDto } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        
        @InjectRepository(UserExtend)
        private readonly UserExtendRepository: Repository<UserExtend>,

        @InjectRepository(Posts)
        private readonly Posts: Repository<Posts>,

        @InjectRepository(Tags)
        private readonly Tags: Repository<Tags>,

        private readonly manager: EntityManager
    ){}

    async findAll(): Promise<User[]> {
        // 第一种方式 对 orm 不熟悉的情况可以使用 sql 语句进行查询
        // const getsql = 'select * from user';
        // return await this.userRepository.query(getsql);

        // 第二种方式
        return await this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        // 第一种方式
        // const getsql = 'select * from user where id =' + id;
        // return await this.userRepository.query(getsql);

        // 第二种方式
        return await this.userRepository.findOne({ where: { id: id } } as any);
    }

    async create(user: User) {
        // 第一种方式
        // const addsql = `INSERT INFO user(username, password) values ("${user.username}", "${user.password}")`;
        // return await this.userRepository.query(addsql);

        // 第二种方式 save() 也可以换成 insert()
        return await this.userRepository.save(user);
    }

    async userExtend(userExtend: UserExtend) {
        return await this.userRepository.save(userExtend);
    }
    
    async update(id: number, user: User): Promise<void> {
        // 第一方式 sql 语句
        // const upsql = `UPDATE user SET name = "${username}" WHERE id = "${id}"`;
        // return await this.userRepository.query(upsql);

        // 第二种方式是替换 save() 也可以换成 insert()
        await this.userRepository.update(id, user);
    }
    
    async delete(id: number): Promise<void> {
        // 第一方式
        // const dsql = `DELETE FROM user WHERE id = ${id}`;
        // return await this.userRepository.query(dsql);

        //第二方式 
        await this.userRepository.delete(id);
    }

    // 一对一表关系插入
    async addTags(body: UserExtendDto) {
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
            throw err;
        }
    }

    // 一对一表关系获取
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

    // 一对多表关系插入
    async addUserAndPosts(body: UserAndPostsDto) {
        try{
            let potosArray = []; // 用于保存已存的图片内容
            if (body.posts) {
                for (let i = 0; i < body.posts.length; i++) {
                    const posts = new Posts();
                    posts.title = body.posts[i].title;
                    posts.content = body.posts[i].content;
                    // 保存至数据库
                    await this.manager.save(Posts, posts);
                    // 保存已存在内容
                    potosArray.push(posts);
                }
            }
            let user = new User();
            user.username = body.username;
            user.password = body.password;
            // 绑定关联
            user.posts = potosArray;
            // 保存
            const main = await this.manager.save(User, user);

            return {
                ...main,
                potos: potosArray
            }
        }catch (err) {
            throw new Error('Failed to save data!'); 
        }
    }

    // 一对多表关系获取
    async getUserAndPosts(id: number) {
        try{
            // 正向查询数据
            // return this.manager.getRepository(User).find({ relations: ['posts'] });
            // 正向查询单个数据
            // return this.manager.getRepository(User).findOne({ where: { id: 12 } });
            // 条件查询
            const res = await this.manager
                .createQueryBuilder(User, "user") // 指定查询的实体类和别名
                .leftJoinAndSelect("user.posts", "post") // 进行左连接查询，关联 User 实体类的 “posts” 属性，别名为 “post”
                .where("user.id = :id", { id: 12 })
                .getOne();
            return res;
            // 反向查询数据
            // return this.manager.getRepository(User).find({ relations: ['posts'] });
        }catch (err) {
            throw new Error('Failed to save data!'); 
        }
    }

    // 多对多表关系插入
    async addPostsAndTags(body: UserAndPostsAndTagsDto) {
        try {
            let potosArray: Posts[] = [];
            for (let i = 0; i < body.posts.length; i++) {
                const posts = new Posts();
                posts.title = body.posts[i].title;
                posts.content = body.posts[i].content;
                let tagsArray: Tags[] = []
                // 保存已存在内容
                potosArray.push(posts);
                for (let j = 0; j < body.posts[i].tags.length; j++) {
                    const tags = new Tags();
                    tags.name = body.posts[i].tags[j].name;
                    tagsArray.push(tags);
                    // 保存至数据库
                    await this.manager.save(Tags, tags);
                }
                // 绑定关联
                posts.tags = tagsArray;
                // 保存至数据库
                await this.manager.save(Posts, posts);
            }
            const user = new User();
            user.username = body.username;
            user.password = body.password;
            user.posts = potosArray;
            await this.manager.save(User, user);
        } catch (err) {
            throw new Error('Failed to save data!'); 
        }
    }

    // 多对多表查询表关系
    async getUserAndPostsAndTags(id: number) {
        const user = await this.Posts.findOne({ where: { id }, relations: ['user', 'tags']});
        return {
            user
        }
    }
}
