import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user';


@Entity({ 
    name: 'user_extend' 
})
export class UserExtend {
    // 下面定义的会自动在数据库中生成对应的字段
    // 主键且自动自增的
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id',
        comment: '主键id'
    })
    id: number;

    @Column({
        type: 'varchar',
        length: 11,
        nullable: false,
        name: 'phone',
        comment: '手机号'
    })
    phone: number;

    @Column({
        type: 'varchar',
        length: 30,
        nullable: false,
        name: 'email',
        comment: '邮箱'
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
        comment: '地址'
    })
    address: string;

    @Column({
        type: 'varchar',
        name: 'userId',
        nullable: true,
        comment: '关联主键'
    })
    userId: number;

    // 使用 @OneToOne 装饰允许我们在两个实体之间创建一对一的关系
    // user => user.userDetail 表示反向关系查询的
    @OneToOne(type => User, user => user.userExtend)
    // @JoinColumn装饰器，表明实体键的对应关系,不是有关系的都要使用,只是在拥有外键约束的这张表的数据模型中使用
    @JoinColumn()
    user: User
}
