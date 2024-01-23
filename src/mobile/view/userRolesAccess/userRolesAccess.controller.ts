import { Controller, Body, Get, Response } from '@nestjs/common';
import { UserRolesAccessService } from './userRolesAccess.service';
import { CreateDto } from './userRolesAccess.dto';

@Controller('userRolesAccess')
export class UserRolesAccessController {
    constructor(
        private readonly userRolesAccessService: UserRolesAccessService
    ) {}

    @Get()
    async createUserRolesAccess(@Body() body: CreateDto, @Response() res) {
        const data = await this.userRolesAccessService.createUserRolesAccess(body)
        res.send({
            data
        })
    }
}

