import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRolesAccessController } from './userRolesAccess.controller';
import { UserRolesAccessService } from './userRolesAccess.service';
import { User } from '@/typeorm/mysql/user.entity';
import { RoleEntity } from '@/typeorm/mysql/role.entity';
import { AccessEntity } from '@/typeorm/mysql/access.entity';
import { UserRoles } from '@/typeorm/mysql/userRoles.entity';
import { RoleAccess } from '@/typeorm/mysql/roleAccess.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            RoleEntity,
            AccessEntity,
            UserRoles,
            RoleAccess
        ])
    ],
    controllers: [UserRolesAccessController],
    providers: [UserRolesAccessService],
    exports: [],
})
export class UserRolesAccessModule {}

