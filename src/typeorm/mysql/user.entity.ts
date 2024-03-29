import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { UserExtend } from './userExtend.entity';
import { Posts } from './posts.entity';
import { UserRoles } from './userRoles.entity';

@Entity({
    name: "user"
})
export class User {
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
        nullable: false,
        length: 50,
        unique: true,
        name: 'username',
        comment: '用户名'
    })
    username: string;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 100,
        comment: '密码'
    })
    password: string;

    @Column({
        type: 'tinyint',
        nullable: false,
        default: () => 0,
        name: 'is_del',
        comment: '是否删除,1表示删除,0表示正常'
    })
    isDel: number;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: false,
        name: 'created_at', // mysql数据库规范是使用下划线命名的,不使用驼峰
        comment: '创建时间'
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        nullable: false,
        name: 'updated_at',
        comment: '更新时间'
    })
    updateAt: Date;

    // 一对多,自然Posts实体类中就是多对一的方式
    @OneToOne(type => UserExtend, userExtend => userExtend.user)
    userExtend: UserExtend;

    @OneToMany(type => Posts, post => post.user)
    posts: Posts[];

    // 用户 + 角色表的多对多关系
    @OneToMany(() => UserRoles, (userRole) => userRole.user)
    userRoles: UserRoles[];
}