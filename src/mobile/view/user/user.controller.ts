import { Controller, Headers, Get, Post, Param, Body, Put, Delete, Response } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@/typeorm/mysql/user.entity';
import { UserExtend } from '@/typeorm/mysql/userExtend.entity';
import { UserDto, UserExtendDto, UserAndPostsDto, UserAndPostsAndTagsDto } from './user.dto';


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
    async create(@Body() body: UserDto, @Response() res) {
        const user = new User(); 
        user.username = body.username;
        user.password = body.password;
        user.isDel = body.is_del || 0;

        await this.userService.create(user);
        res.send({
            code: "E1",
            msg: "成功"
        });
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() user, @Response() res) {
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
        await this.userService.delete(id);
        res.send({
            code: "E1",
            msg: "成功"
        });
    }

    // 一对一插入
    @Post('add/addTags')
    async addTags(@Body() body: UserExtendDto, @Response() res) {
        this.userService.addTags(body)
        res.send({
            code: "E1",
            msg: "成功"
        });
    }

    // 一对一查询 http://localhost:3000/user/mainAndSub/11 下面是全部查看不是按ID查询,但是可以
    @Get('mainAndSub/:id')
    async getMainAndSub(@Param('id') id: number, @Response() res) {
        const value = await this.userService.getMainAndSub(id);
        res.send({
            code: "E1",
            msg: "成功",
            data: value
        });
    }

    // 一对多插入
    @Post('add/addUserAndPosts')
    async addUserAndPosts(@Headers('Content-Type') contentType: string, @Body() body: UserAndPostsDto, @Response() res) {
        const value = await this.userService.addUserAndPosts(body);
        res.send({
            code: "E1",
            msg: "成功",
            data: value
        });
    }

    // 一对多查询
    @Get('userAndPosts/:id')
    async getUserAndPosts(@Param('id') id: number, @Response() res) {
        const value = await this.userService.getUserAndPosts(id);
        res.send({
            code: "E1",
            msg: "成功",
            data: value
        });
    }

    // 多对多插入
    @Post('add/postsAndTags')
    async addPostsAndTags(@Body() body: UserAndPostsAndTagsDto, @Response() res) {
        const value = await this.userService.addPostsAndTags(body);
        res.send({
            code: "E1",
            msg: "成功",
            data: value
        }); 
    }

    // 多对多查询
    @Get('userAndPostsAndTags/:id')
    async userAndPostsAndTags(@Param('id') id: number, @Response() res) {
        const value = await this.userService.getUserAndPostsAndTags(id);
        res.send({
            code: "E1",
            msg: "成功",
            data: value
        }); 
    }
}
