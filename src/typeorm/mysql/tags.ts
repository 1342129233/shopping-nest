import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Posts } from './posts';

@Entity({
    name: 'tags'
})
export class Tags {
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
        name: 'name',
        comment: 'tag名称'
    })
    name: string;

    // 多对多
    @ManyToMany(type => Posts, post => post.tags)
    posts: Posts[];
}
