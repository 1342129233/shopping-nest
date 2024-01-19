import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';
 
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) {}
 
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        console.log()
        const token = request.headers['token']; // 从请求头中获取 token
        if (!token) {
            return false;
        } else {
            return this.authService.validateToken(token); // 如果 token 有效，返回 true，允许访问资源
        }
    }
}