import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, EntityManager, QueryRunner, MoreThanOrEqual } from 'typeorm';
import { User } from '@/typeorm/mysql/user.entity';
import { RoleEntity } from '@/typeorm/mysql/role.entity';
import { AccessEntity } from '@/typeorm/mysql/access.entity';
import { UserRoles } from '@/typeorm/mysql/userRoles.entity';
import { RoleAccess } from '@/typeorm/mysql/roleAccess.entity';
import { CreateDto } from './userRolesAccess.dto';

@Injectable()
export class UserRolesAccessService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(RoleEntity)
        private readonly roleRepo: Repository<RoleEntity>,
        @InjectRepository(AccessEntity)
        private readonly accessRepo: Repository<AccessEntity>,
        @InjectRepository(UserRoles)
        private readonly userRolesRepo: Repository<UserRoles>,
        @InjectRepository(RoleAccess)
        private readonly roleAccessRepo: Repository<RoleAccess>,
    ) {}

    async createUserRolesAccess(dto: CreateDto) {
        const user = new User();
        user.username = dto.user.username;
        user.password = dto.user.password;
        const userMain = await this.userRepo.save(user);

        const role = new RoleEntity();
        role.roleTitle = dto.role.title;
        role.description = dto.role.description;
        const roleMain = await this.roleRepo.save(role);

        const access = new AccessEntity();
        access.moduleName = dto.access.moduleName;
        access.type = dto.access.type;
        access.actionName = dto.access.actionName;
        access.icon = dto.access.icon;
        access.url = dto.access.url;
        access.method = dto.access.method;
        access.sort = dto.access.sort;
        access.description = dto.access.description;
        const accessMain = await this.accessRepo.save(access);

        const userRole = new UserRoles();
        userRole.user = user;
        userRole.userId = userMain.id;
        userRole.role = role;
        userRole.roleId = roleMain.id;

        const roleAccess = new RoleAccess();
        roleAccess.role = role;
        roleAccess.roleId = roleMain.id;
        roleAccess.accessEntity = access;
        roleAccess.accessId = accessMain.id;

        const userRoleMain = await this.userRolesRepo.save(userRole);
        const roleAccessMain = await this.roleAccessRepo.save(roleAccess);
        return '成功';
    }

    async getUserRolesAccess(req: { userId: number, roleId: number }) {
        // 获取已设置的角色
        const roleList = await this.userRolesRepo.find({ where: { userId: req.userId }, select: ['roleId'] });
        // 提取全部的id
        const roleIdList = await roleList.map(item => item.roleId);
        // 获取全部角色
        const result = await this.roleRepo.find({ where: { isDel: 0 } });

        const all = result.map((item: any) => ({
            id: item.id,
            key: item.id.toString(),
            title: item.roleTitle,
            direction: roleIdList.includes(item.id) ? 'right' : 'left',
        }))
        return all;
    }
}

