/**
 * 全局响应拦截器,统一返回内容
 */
import { Injectable, NestInterceptor, CallHandler, ExecutionContext, Inject } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// 返回体结构
interface ResponseData<T> {
    data: T;
}

// 拦截器 每次返回的时候自动带上 code: 200
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseData<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<ResponseData<T>> {
        // 解析 ExecutionContext 的数据内容获取到请求体
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        // 实现数据的遍历与转变
        console.log("进入全局响应拦截器...");
        return next.handle().pipe(
            map(data => {
                console.log('全局响应拦截器方法返回内容后...');
                const res: any = context.switchToHttp().getResponse();
                // console.log(res.json({ code: 200, data }));

                return {
                    statusCode: 0,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: '请求成功',
                    data
                };
            })
        )
    }
}
