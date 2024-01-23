// 资源表
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { RoleAccess } from './roleAccess.entity';

@Entity({
    name: 'access'
})
export class AccessEntity {
    // 表主键
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
        name: 'module_name',
        comment: '资源名称',
    })
    moduleName: string;

    @Column({
        type: 'int',
        nullable: false,
        default: 3,
        name: 'type',
        comment: '类型,模块顶级模块: 1, 表示菜单: 2, 操作: 3'
    })
    type: number;

    @Column({
        type: 'varchar',
        nullable: false,
        unique: false, // 这是一个唯一性约束，表示该列的值必须在整个表中是唯一的。也就是说，你不能在这个列中插入两个相同的值。例如，用户的电子邮件地址通常应该是唯一的，所以你可以在电子邮件地址列上设置 unique 约束
        length: 100,
        name: 'action_name',
        comment: '操作名称'
    })
    actionName: string;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 100,
        name: 'icon',
        comment: '小图标'
    })
    icon: string;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 100,
        name: 'url',
        comment: 'url地址'
    })
    url: string;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 10,
        name: 'method',
        comment: '请求方式'
    })
    method: string;

    @Column({
        type: 'int',
        nullable: false,
        default: -1,
        name: 'module_id',
        comment: '父模块id'
    })
    moduleId: number;

    @Column({
        type: 'int',
        nullable: false,
        default: 1,
        name: 'sort',
        comment: '排序'
    })
    sort: number;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 100,
        name: 'description',
        comment: '描素'
    })
    description: string;

    @Column({
        type: 'tinyint',
        nullable: false,
        default: 0,
        name: 'is_del',
        comment: '是否删除,1表示删除,0表示正常'
    })
    isDel: number;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: false,
        name: 'created_at',
        comment: '创建时间'
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        nullable: false,
        name: 'updated_at',
        comment: '更新时间',
    })
    updatedAt: Date;

    //
    @OneToMany(() => RoleAccess, (roleAccess) => roleAccess.accessEntity)
    roleAccess: RoleAccess[];
}

