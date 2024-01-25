import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { RedisService } from 'nestjs-redis';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        // private readonly redisService: RedisService
    ) { }

    async canActivate(context: ExecutionContext) {
        // 在这里执行全局守卫逻辑
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
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
                    // 获取时间
                    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
                    // 获取token 还有多久过期时间
                    const tokenWillExpireIn = validRes.exp - currentUnixTimestamp;
                    // 如果token在5分钟内就要过期，则重新生成token
                    if (tokenWillExpireIn < 5 * 60) {
                        // 新的 token, 新的 token 最好获取用户 账户密码去生成
                        const newToken = this.jwtService.sign(validRes);
                        // 设置新的 token 在 redis 中
                        // const client = this.redisService.getClient(); // 获取

                        // 如果用户已经登录，则踢掉之前的token，更新token并且存入新的token
                        // const userTokens = await client.lrange(user.userId, 0, -1); 获取数组
                        // 如果用户已经登录，则踢掉之前的token，更新token并且存入新的token
                        // if (userTokens.length >= 3) {
                        //     await client.lpop(user.userId);
                        // }
                        // await client.rpush(user.userId, token);


                        // await client.set(username, newToken, 'EX', 60 * 60 * 24); // 设置过期时间为24小时
                        response.setHeader('token', newToken);
                    }
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

// token续期: 获取时间,是否需要生成新的 token
// 互踢: 重新生成 token
// 单点登录 sso: 登录验证
// 多端登陆: 每次用户在新设备上登录时，都会生成新的JWT
// 限制账号 5个终端 同时登陆: 存入一个 new Map(), 如果用户已经登录，则踢掉之前的token，更新token并且存入新的token
// 限制ip: 中间件将检查每个请求的IP地址，如果它不在允许的IP地址列表中，就会抛出一个ForbiddenException
