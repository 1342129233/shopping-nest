import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
    name: "user"
})
export default class User {
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

    @Column('tinyint',{
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
}
