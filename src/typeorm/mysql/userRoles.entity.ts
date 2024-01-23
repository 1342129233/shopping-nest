// 用户 + 角色表关联
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { RoleEntity } from './role.entity';

@Entity({
    name: 'user_roles'
})
export class UserRoles {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    roleId: number;


    // onDelete 实体被删除，那么关联的 User 实体也会被删除
    //      "CASCADE"：当关联的实体被删除时，删除此实体
    //      "SET NULL"：当关联的实体被删除时，将此列设置为 NULL
    //      "DEFAULT"：当关联的实体被删除时，将此列设置为其默认值
    //      "RESTRICT"：如果此实体有关联的实体，不允许删除此实体
    //      "NO ACTION"：不采取任何行动
    // primary 选项用于指定一个列作为主键
    @ManyToOne(() => User, user => user.userRoles) // , { primary: true, onDelete: 'CASCADE' }  
    @JoinColumn({ name: "userId" })
    user: User;
  
    @ManyToOne(() => RoleEntity, role => role.userRoles) // , { primary: true, onDelete: 'CASCADE' }
    @JoinColumn({ name: "roleId" })
    role: RoleEntity;
}