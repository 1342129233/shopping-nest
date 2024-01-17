/**
 * 全局响应拦截器,统一返回内容
 */
import { Injectable, NestInterceptor, CallHandler, ExecutionContext, Inject } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// 返回体结构
interface Response<T> {
    data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<Response<T>> {
        // 解析 ExecutionContext 的数据内容获取到请求体
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        // 实现数据的遍历与转变
        console.log("进入全局响应拦截器...");
        return next.handle().pipe(
            map(data => {
                console.log('全局响应拦截器方法返回内容后...');
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
