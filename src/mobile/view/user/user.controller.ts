import { Controller, Get, Post, Param, Body, Put, Delete, Response } from '@nestjs/common';
import { UserService } from './user.service';
import User from '@/typeorm/mysql/user';
import { CreateUserDto } from './user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findAll(@Response() res) {
        const value = await this.userService.findAll();
        res.send({
            code: "E1",
            msg: "成功",
            data: value
        });
    }

    @Get(':id')
    async findOne(@Param('id') id: number, @Response() res) {
        const value = await this.userService.findOne(id);
        res.send({
            code: "E1",
            msg: "成功",
            data: value
        });
    }

    @Post('create')
    async create(@Body() body: CreateUserDto, @Response() res) {
        console.log(111, body)
        // const user = new User(); 
        // user.username = body.username;
        // user.password = body.password;
        // user.isDel = body.is_del || 0;
        // await this.userService.create(user);
        res.send({
            code: "E1",
            msg: "成功"
        });
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() user, @Response() res) {
        console.log('update', id, user);
        const value = await this.userService.findOne(id);
        const users = {
            ...value,
            ...user
        }
        await this.userService.update(id, users);
        res.send({
            code: "E1",
            msg: "成功"
        });
    }

    @Delete(':id')
    async delete(@Param('id') id: number, @Response() res) {
        console.log('id', id);
        await this.userService.delete(id);
        res.send({
            code: "E1",
            msg: "成功"
        });
    }
}
