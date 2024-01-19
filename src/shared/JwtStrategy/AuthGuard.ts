import { Injectable, ExecutionContext, CanActivate, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import { User } from '@/typeorm/mysql/user';

// Reflector 是 Nest 提供的元数据查找工具；
// JwtService 是 Nest 提供的封装了 JWT token 相关操作的工具类
// AuthService 是自定义的用于用户身份验证的服务类
// ExecutionContext 是 Nest 提供的执行上下文对象，通过它可以获取到当前的请求对象和处理器对象
// UnauthorizedException 是 Nest 提供的异常类，用于抛出权限验证相关的异常

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector, 
        private readonly jwtService: JwtService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.get(User, context.getHandler())
        if (isPublic) {
            return true
        }
        const request = context.switchToHttp().getRequest();
        const token = request.headers.token;
        if (!token) {
            throw new UnauthorizedException('请登录')
        }
        try {
            const user = this.jwtService.verify(token)
            request.user = user
            return true
        } catch (error) {
            throw new UnauthorizedException('请登录')
        }
    }
}
