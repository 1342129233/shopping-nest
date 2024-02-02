/**
 * xml 请求支持中间件,依赖于 xml2js 来处理 xml 格式内容并且将其转换为 json
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as xml2js from 'xml2js';

const parser = new xml2js.Parser();

@Injectable()
export class XmlMiddleware implements NestMiddleware {
    // 参数是固定的 Request/Response/next
    use(req: Request, res: Response, next: Function) {
        console.log('进入全局 xml 中间件...');
        // 获取 express 原生请求对象 req, 找到其请求内容,如果包含 application/xml,则执行转换
        if(req.headers['content-type'] && req.headers['content-type'].includes('application/xml')) {
            // 监听 data 方法获取到对应的参数数据
            req.on('data', mreq => {
                // 使用 xml2js 对 xml 数据进行转换
                parser.parseString(mreq, function(err, result) {
                    // 将转换后的数据放入到请求对象的 req 中
                    console.log('parseString 转换后的数据', result);
                    // 这里根据需要做一些修改以补充完善内容
                    req['body'] = result;
                })
            })
        }
        // 调用 next 方法,进入到写一个中间件或者路由
        next();
    }
}

