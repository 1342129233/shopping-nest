### 1.@module 声明Module
```JS
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
```

### 2.@Controller 声明Controller
```JS
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Inject("myToken") 
    private readonly myToken: { token: number }

    @Optional()
    @Inject("name") 
    private readonly name: { token: number }

    @Get()
    index() {
        console.log(this.myToken)
        return this.appService.getHello();
    }
}
```

### 3.@Inject 声明Provider
```JS
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }
}
```

### 4.@Inject指定注入的 token
##### 1.可以使用useFactory动态注入provider的值
##### 2.使用useExisting别名指定
```JS
// module 模块
import { Module } from '@nestjs/common';
import { AppController } from './content.controller';
import { AppService } from './content.service';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [
        {
            provide: 'myToken',
            useValue: {
                token: 456
            }
        },
        AppService
    ],
})

export class ContentModule {}

// controller 模块
import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './content.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Inject("myToken") // 注入的信息
    private readonly myToken: { token: number }

    @Get()
    index() {
        console.log(this.myToken)
        return this.appService.getHello();
    }
}

```

### 5.@Optional声明为可选的
```JS
// module 模块
import { Module } from '@nestjs/common';
import { AppController } from './content.controller';
import { AppService } from './content.service';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [
        {
            provide: 'myToken',
            useValue: {
                token: 456
            }
        },
        AppService
    ],
})

export class ContentModule {}

// controller 模块
import { Controller, Get, Inject, Optional } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Optional(); // 在 module 模块 中如果不写 myToken, 在这里又不加 Optional 就会报错, Optional 为可选的
    @Inject('myToken')
    private readonly myToken: Record<string, any>;

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
```

### 6.@Global 把它声明为全局
```JS
// 如果一个模块被很多地方都引用了，可以使用@Global将其设置为全局模块这样它exports的provider就可以直接注入使用
import { Global, Module } from '@nestjs/common';
import { AaaService } from './aaa.service';
import { AaaController } from './aaa.controller';

@Global()
@Module({
    imports: []
    controllers: [AaaController],
    providers: [AaaService],
    exports: [AaaService],  // 导出
})
export class AaaModule {}
```


### 7.@Catch 来指定处理的异常
```JS
// filter是处理抛出的未捕获异常，通过@Catch来指定处理的异常：
// @UseGuards、@UseInterceptors、@UsePipes
// 这三种用法和@UseFilters 用法一样，需要先建立对应的provider，然后再使用对应的装饰器去调用
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AaaFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const response: Response = host.switchToHttp().getResponse();
        response.status(exception.getStatus()).json({
            msg: exception.message,
        });
    }
}
// 后通过 @UseFilters 应用到 handler 上：
import {
    Controller,
    Get,
    UseFilters,
    HttpStatus,
    HttpException,
} from '@nestjs/common';
import { AaaService } from './aaa.service';
import { AaaFilter } from './aaa.filter';

@Controller('aaa')
export class AaaController {
    constructor(private readonly aaaService: AaaService) {}


    @Get()
    @UseFilters(AaaFilter)
    findAll() {
        throw new HttpException('xxx', HttpStatus.BAD_REQUEST);
        return this.aaaService.findAll();
    }
}
```

### 8.请求参数相关的装饰器
```JS
// @Param、@Query
// @Param 是获取路径中的参数，而@ Query 是获取url问号中的参数
// 测试: localhost:3000/user/1?name=wang
import { Controller, Get, Params } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get("/user:id")
    index(@Param("id") id: string, @Query("name") name: string) {
        console.log({"id": id, "name": name}); // { "id": 1, "name": wang}
        return this.appService.getHello();
    }
}

// @Post、@Body
import { Controller, Get, Params, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Post("/register")
    index(@Body("id") userInfo: { id: number, name: string }) {
        console.log(userInfo); // { "id": 1, "name": wang}
        return this.appService.getHello();
    }
}

// @Put、@Delete、@Patch、@Options、@Head 分别接受 put、delete、patch、options、head 的请求
```

### 9.@SetMetadata 指定 metadata
```JS
// aaa.controller.ts

import {
    Controller,
    Get,
    SetMetadata,
    UseGuards,
} from '@nestjs/common';
import { AaaService } from './aaa.service';
import { CreateAaaDto } from './dto/create-aaa.dto';
import { UpdateAaaDto } from './dto/update-aaa.dto';
import { AaaGuard } from './aaa.guid';

@Controller('aaa')
@SetMetadata('roles', ['user'])
export class AaaController {
    constructor(private readonly aaaService: AaaService) {}

    @Get()
    @UseGuards(AaaGuard)
    @SetMetadata('roles', ['admin'])
    findAll() {
        return this.aaaService.findAll();
    }
}

// aaa.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AaaGuard implements CanActivate {
    @Inject(Reflector)
    private readonly reflector: Reflector;

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const classMetaDatas = this.reflector.get('roles', context.getClass());
        const methodMetaDatas = this.reflector.get('roles', context.getHandler());

        console.log(classMetaDatas, methodMetaDatas); // ["user"] ["admin"]
        return true;
    }
}
```

### 10.@Headers获取请求头 和 Header 修改请求头
```JS
// 获取
@Get('/header')
header(
    @Headers('Accept') accept: string,
    @Headers() headers: Record<string, any>,
) {
    console.log('accept', accept);
    console.log('headers', headers);
}

//修改
@Get('/a2')
@Header('Content-Type', 'text/html') // 这个是修改的
header() {

}
```

### 11.@Session拿到session对象
```JS
// 要使用 session 需要安装一个 express 中间件：
pnpm install express-session
// 会返回 Set-Cookie 的响应头，设置了 cookie，包含 sid 也就是 sesssionid

// 实例
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(
        session({
            secret: 'xiumu',
            cookie: { maxAge: 1000 },
        }),
    );
    await app.listen(3000);
}
bootstrap();
```

### 11.@HostParam获取域名部分的参数
```JS
// 这样只有通过xxx.0.0.1访问的才能通过
// localhost:3000/bbb/a1
// localhost:3000，这样的地址访问就不会访问到这个controller了，会发现只有host满足xx.0.0.1的时候才会路由到这个controller
import {
    Controller,
    Get,
    HostParam,
} from '@nestjs/common';
import { BbbService } from './bbb.service';

@Controller({ host: ':host.0.0.1', path: 'bbb' })
export class BbbController {
    constructor(
        private readonly bbbService: BbbService,
    ) {}

    @Get('a1')
    host(@HostParam('host') host) {
        return host;
    }
}

```

### 12.@Req 和 @Request
```JS
// 这两个装饰器是同一个东西，可以获取到request里的内容，当注入request对象后可以手动获取到请求中的参数：
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('example')
export class ExampleController {

    @Get()
    getExample(@Req() request: Request): string {
        console.log(request.query); // 访问查询参数
        console.log(request.headers); // 访问请求头
        return 'example';
    }
}
```

### 13.@Res 和 @Response
```JS
// 这两个也是一个东西，只不过response有点特殊，在注入它的时候需要手动end，不然服务会一直卡着没有响应：
// 这样设计是为了避免你自己返回的响应和nest返回的响应冲突。
// 如果自己不想手动end，还可以通过向@Res中传入 passthrough 参数，来返回响应:
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('example')
export class ExampleController {

    @Get()
    getExample(@Res() response: Response): string {
        response.status(201); // 设置状态码
        response.set('Location', '/example'); // 设置响应头
        // response.end()
        return 'passthrough';
    }
}

```

### 14.@Next 装饰器
```JS
npm install @types/next next
// 需要注意的是，@Next 装饰器注入的对象不同于普通 Express 的 Request 和 Response 对象，而是 Next.js 的 NextApiRequest 和 NextApiResponse 对象。因此，在使用时需要针对 Next.js 的 API 进行操作

import { Controller, Get, Next } from '@nestjs/common';
import { NextApiResponse, NextApiRequest } from 'next';

@Controller('example')
export class ExampleController {

    @Get()
    getExample(@Next() { res, req }: { res: NextApiResponse; req: NextApiRequest }): string {
        console.log(req.query); // 访问查询参数
        console.log(req.headers); // 访问请求头
        res.status(201); // 设置状态码
        res.setHeader('Location', '/example'); // 设置响应头
        return 'created';
    }
}
```
### 15.IP
```JS
import { Controller, Get, Next } from '@nestjs/common';
import { NextApiResponse, NextApiRequest } from 'next';

@Controller()
export class ExampleController {

    @Get('/ip')
    getIp(@Ip() ip: string){
        console.log(ip, 'ip');
        res.status(200); // 设置状态码
        return 'created';
    }
}
```

### 16.HttpCode
```JS
// 可以通过这个来修改请求的状态码：
import {
    Controller,
    Get,
    HostParam,
} from '@nestjs/common';
import { BbbService } from './bbb.service';

@Controller({ host: ':host.0.0.1', path: 'bbb' })
export class BbbController {
    constructor(
        private readonly bbbService: BbbService,
    ) {}

    @Get('a1')
    @HttpCode(403)
    host(@HostParam('host') host) {
        return host;
    }
}
```

### 17.@Redirect：指定重定向的 url
```JS
@Get('redirect')
@Redirect('https://juejin.cn')
hello() {
    return 'hello';
}
```

### 18.自定义方法装饰器
```JS
// 把 @SetMetaData 自定义一下
// bbb.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const Bbb = (...args: string[]) => SetMetadata('aaa', args);

// Controller
import {
    Controller,
    Get,
    HostParam,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { BbbService } from './bbb.service';
import { Bbb } from './bbb.decorator'; // 引入自定义的装饰器
import { BbbGuard } from './bbb.guard';

@Controller({ host: ':host.0.0.1', path: 'bbb' })
export class BbbController {
    constructor(
        private readonly bbbService: BbbService,
    ) {}

    @Get()
    @UseGuards(BbbGuard)
    @Bbb('admin') // 使用自定义装饰器
    findAll() {
        return this.aaaService.findAll();
    }
}

// 我们可以把这三个装饰合并成一个使用：
// merge.decorator.ts
import { applyDecorators, Get, UseGuards } from '@nestjs/common';
import { Bbb } from './bbb.decorator';
import { BbbGuard } from './bbb.guard';

export function Merge(path, role) {
    return applyDecorators(Get(path), Bbb(role), UseGuards(BbbGuard));
}

// 在 Controller 页面使用
@Merge('hello2', 'admin') // 是哟办法
getHello3(): string {
    return 'this is merge decorator';
}
```

### 19.自定义参数装饰器
```JS
// ccc.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Ccc = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        return 'ccc';
    },
);
// 使用
import { Controller, Get } from '@nestjs/common';
import { CccService } from './ccc.service';
import { Ccc } from './ccc.decorator';
@Controller('ccc')
export class CccController {
    constructor(private readonly cccService: CccService) {}

    @Get('arg')
    getArg(@Ccc() c) { // 使用参数装饰器
        return c; // 值为 ccc
    }
}
// 这里拿到的c就是参数装饰器的返回值。
// 在我们自定义的装饰器中，data 很明显就是传入的参数，而 ExecutionContext 前面用过，可以取出 request、response 对象
// 这样，那些内置的 @Param、@Query、@Ip、@Headers 等装饰器，我们也可以自己实现了
// 下面我们实现一个Header装饰器
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const MyHeaders = createParamDecorator(
    (key: string, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();
        return key ? request.headers[key] : request.headers;
    }
);

// 使用
@Get('my')
getHeader(@Headers('Accept') headers1, @MyHeaders('accept') headers2) {
    console.log('headers1', headers1);
    console.log('headers2', headers2);
}

// 这里我们的@@MyHeaders和@Headers具有同样的效果，都能拿到Accept的值。
// 注意：@MyHeaders()接受的参数是accept，小写开头， 值为 headers 123


// 下面我们再实现一个query装饰器
export const MyQuery = createParamDecorator(
    (key: string, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();
        return request.query[key];
    }
);

// 使用
 @Get('query')
getHello6(@Query('aaa') aaa, @MyQuery('bbb') bbb) {
    console.log('aaa', aaa);
    console.log('bbb', bbb);
}
// 可以拿到query返回的参数，我们根据key值，取到返回了
```

### 20.自定义 class 装饰器
```JS
// 自定义 class的装饰器
// myHeaders.decorator.ts
export const MyClass = () => Controller('class');

// 使用
import { Controller, Get, Headers, Query } from '@nestjs/common';
import { CccService } from './ccc.service';
import { Ccc } from './ccc.decorator';
import { MyHeaders, MyQuery, MyClass } from './myHeaders.decorator';
// @Controller('ccc')
@MyClass()
export class CccController {
    constructor(private readonly cccService: CccService) {}

    @Get('arg')
    getArg(@Ccc() c) {
        return c;
    }

    @Get('my')
    getHeader(@Headers('Accept') headers1, @MyHeaders('Accept') headers2) {
        console.log('headers1', headers1);
        console.log('headers2', headers2);
    }

    @Get('query')
    getHello6(@Query('aaa') aaa, @MyQuery('bbb') bbb) {
        console.log('aaa', aaa);
        console.log('bbb', bbb);
    }
}
// 我们把@Controller('ccc')替换成了@MyClass()，然后访问一下http://127.0.0.1:3000/class/query?aaa=aaa&bbb=bbb，同样也是没问题的
```

### 21.UseGuards 装饰器
```JS
// 我们在 findAll 方法上使用了 UseGuards 装饰器，并传入了 AuthGuard 身份验证守卫。这将确保只有通过身份验证的用户才能访问 /users 路由
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(AuthGuard)
    async findAll() {
        return this.userService.findAll();
    }
}
```

### 22.CanActivate 装饰器
```JS
import { Controller, Get, metadata } from '@nestjs/common';

@Controller('cats')
class CatsController {
    @Get()
    @metadata('role', 'admin')
    getCat(): string {
        return 'Hello Cat';
    }
}
```

### 23.Reflector 装饰器
```JS
// Reflector 则是一个类，可以通过构造函数中注入 Injector 来创建。它提供了若干个方法，用于获取类、方法和属性的元数据，并返回反应这些元数据的方法调用

import { Controller, Get, metadata, Reflector } from '@nestjs/common';

@Controller('cats')
class CatsController {
    constructor(private readonly reflector: Reflector) {}

    @Get()
    @metadata('role', 'admin')
    getCat(): string {
        const role = this.reflector.get<string>('role', CatsController.prototype.getCat);
        return `Hello Cat, your role is ${role}`;
    }
}
// 以上代码创建了一个 CatsController 类，并在其 getCat() 方法上添加了一个元数据 role，
// 值为 admin。在 CatsController 类的构造函数中注入了 Reflector，并在 getCat() 方法中使用 
// reflector.get() 方法获取元数据 role 的值，并将其展示在返回结果中
```
