import { Controller, Get, Post, Body, UseGuards, Request, Response } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from './auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

    @Get()
    getHello(): string {
        return this.authService.getHello()
    }

    @Get('login')
    async login(@Body() body, @Response() res) {
        const token = await this.authService.login(body);
        if(token) {
            res.cookie('token', token, { httpOnly: true, sameSite: true }); // 将 token 写入 cookies
            res.send({
                token
            })
        } else {
            return {
                code: 204,
                msg: '用户名或密码错误'
            }
        }
    }

    // 在接口调用的过程中，带上上面生成的 token，然后在控制器中使用 jwtService 的 verify 方法来验证 token
    @Get('profile')
    @UseGuards(AuthGuard) // 使用了 UseGuards 装饰器来使用 jwt 的验证 // AuthGuard 的参数是 jwt，表示使用 jwt 的验证
    getProfile() {
        return {
            name: '检测登录jwt鉴权成功'
        }
    }
}

