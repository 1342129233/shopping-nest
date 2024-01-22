import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService
    ) { }

    canActivate(context: ExecutionContext) {
        // 在这里执行全局守卫逻辑
        const request = context.switchToHttp().getRequest();
        // 请求的url，用于判断是否需要校验jwt
        const path = request.route.path;
        // 从请求头中获取 token, 前者在 postman 中使用
        const token = request.headers['token'] || windowCookies(request.headers.cookie); // 从请求头中获取 token
        const isJwtUrl = ['/auth/login'].includes(path);
        // 不需要校验的接口
        if (!isJwtUrl) {
            try {
                const validRes = this.jwtService.verify(token);
                
                if (validRes) {
                    return true;
                }
                return false;
            } catch (error) {
                // 如果验证失败，则抛出 UnauthorizedException 异常，并且包含一个自定义的错误信息
                throw new UnauthorizedException('JWT 令牌错误');
            }
        }
        return true;
    }
}

// 在浏览器中使用
function windowCookies(cookies: string) {
    const cookieMap = new Map();
    if(cookies) {
        const list = cookies.split('; ');
        list.forEach((item: string) => {
            const itemlist: string[] = item.split('=');
            cookieMap.set(itemlist[0], itemlist[1]);
        });
    }
    return cookieMap.get('token');
}
