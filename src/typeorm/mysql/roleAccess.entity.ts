// 角色表 + 资源表关联
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { RoleEntity } from './role.entity';
import { AccessEntity } from './access.entity';

@Entity({
    name: 'role_access'
})
export class RoleAccess {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roleId: number;

    @Column()
    accessId: number;

    @ManyToOne(() => RoleEntity, (role) => role.roleAccess) // , { primary: true, onDelete: 'CASCADE' }
    @JoinColumn({ name: "roleId" })
    role: RoleEntity;

    @ManyToOne(() => AccessEntity, access => access.roleAccess) // , { primary: true, onDelete: 'CASCADE' }
    @JoinColumn({ name: "accessId" })
    accessEntity: AccessEntity;
}
