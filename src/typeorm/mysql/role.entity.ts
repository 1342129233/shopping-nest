// 角色表
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { UserRoles } from './userRoles.entity';
import { RoleAccess } from './roleAccess.entity';

@Entity({
    name: 'roles'
})
export class RoleEntity {
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
        name: 'role_title',
        comment: '角色配置'
    })
    roleTitle: string;

@Column({
    type: 'varchar',
    nullable: false,
    length: 100,
    name: 'description',
    comment: '角色描述'
})
description: string;

    @Column({
        type: 'int',
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

    // 用户 + 角色表的一对多关系
    @ManyToMany(() => UserRoles, (userRole) => userRole.role)
    userRoles: UserRoles[];

    @ManyToMany(() => RoleAccess, (roleAccess) => roleAccess.role)
    roleAccess: RoleAccess[];
}

