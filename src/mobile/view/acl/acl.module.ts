import { Module } from '@nestjs/common'
import { AclService } from './acl.service';
import { AclController } from './acl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/typeorm/mysql/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [AclController],
    providers: [AclService],
    exports: [AclService],
})
export class AclModule {
    
}
