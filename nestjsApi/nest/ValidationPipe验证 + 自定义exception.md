### 如何使用 ValidationPipe 验证 post 请求参数
```JS
// 需要引入@nestjs/common和class-validator两个模块
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}

// 接下来，定义需要验证参数的 DTO 类。在定义类时，需要使用 class-validator 模块提供的装饰器来定义验证规则。
// 例如，如果要验证一个请求参数 username 是否必填和是否为字符串类型，则可以定义如下的DTO类：
// 当请求参数不符合规则时，会返回400 Bad Request错误。如果想要自定义错误信息，可以在DTO类中使用装饰器参数来定义错误提示信息：
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDto {
    @IsNotEmpty({ message: '用户名不能为空' })
    @IsString({ message: '用户名必须为字符串类型' })
    username: string;
}

// 最后，在controller中使用Dto对象来验证请求参数：
import { Body, Controller, Post } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';

@Controller('users')
export class UsersController {
    @Post()
    create(@Body() createDto: CreateDto) {
        return 'This action adds a new user';
    }
}
```

### nestjs 如何自定义 Exception Filter
自定义 Exception Filter 分为两种方式：
1.继承 BaseExceptionFilter 类并重写其方法来处理异常
2.使用 @Catch 装饰器创建自定义异常过滤器类
```typescript
// 一
// 继承 BaseExceptionFilter, 可以重写下列方法：
// catch: 可以在这个方法中处理对应的异常
// handleUnknownError: 可以在这个方法中处理未知的异常
// getErrorMetatype: 可以在这个方法中控制错误的返回格式
// 例如, 以下代码展示了一个自定义的 HttpExceptionFilter 类, 用来捕获所有 HttpException 异常并返回特定格式的错误信息:
import { BaseExceptionFilter } from '@nestjs/core';
import { HttpException } from '@nestjs/common';

export class HttpExceptionFilter extends BaseExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const message = exception.getResponse();

        response.status(status).json({
            success: false,
            statusCode: status,
            message
        })
    }
}

// 二
// 使用 @Catch 装饰器可以方便的自定义异常过滤器类，示例代码:
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const message = exception.getResponse();

        response.status(status).json({
            success: false,
            statusCode: status,
            message,
        });
    }
}

// 然后在需要使用的控制器或者方法上使用 @UseFilters() 装饰器加载异常过滤器即可。
// 例如，以下代码展示如何在控制器中使用 HttpExceptionFilter 类：
import { Controller, Get, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

@Controller()
@UseFilters(HttpExceptionFilter)
export class AppController {
    @Get()
    getHello() {
        throw new HttpException('Forbidden', 403);
    }
}
```
