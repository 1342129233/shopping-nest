import { Controller, Body, Get, Response, Post, Query } from '@nestjs/common';
import { UserRolesAccessService } from './userRolesAccess.service';
import { CreateDto } from './userRolesAccess.dto';

@Controller('userRolesAccess')
export class UserRolesAccessController {
    constructor(
        private readonly userRolesAccessService: UserRolesAccessService
    ) {}

    @Post('create')
    async createUserRolesAccess(@Body() body: CreateDto, @Response() res) {
        const data = await this.userRolesAccessService.createUserRolesAccess(body)
        res.send({
            data
        })
    }

    @Get('user')
    async getUserRolesAccess(@Query('userId') userId: string, @Query('roleId') roleId: string, @Response() res) {
        const queryReq = {
            userId: +userId,
            roleId: +roleId
        }
        const data = await this.userRolesAccessService.getUserRolesAccess(queryReq);
        res.send({
            data
        })
    }
}

