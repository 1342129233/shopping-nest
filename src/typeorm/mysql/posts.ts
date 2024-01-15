import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user';
import { Tags } from './tags';

@Entity({
    name: 'posts'
})
export class Posts {
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
        name: 'title',
        comment: '标题'
    })
    title: string;

    @Column({
        type: 'text',
        nullable: true,
        name: 'content',
        comment: '内容'
    })
    content: string;
    
    @Column('tinyint', {
        nullable: false,
        default: () => 0,
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
    updateAt: Date;

    @Column({
        type: 'varchar',
        name: 'userId',
        nullable: true,
        comment: '关联主键'
    })
    userId: number;

    // 多对一
    @ManyToOne(type => User, user => user.posts)
    user: User;

    @ManyToMany(type => Tags)
    @JoinTable() // 这个装饰器的实体类为主要操作对象
    tags: Tags[];
}

