### 1.ParseIntPipe
```JS
// 当传进来的 a 无法转化成数字的时候会报错,报错信息可自定义
import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(@Query('a', ParseIntPipe) aa): string {
        return aa + 1;
    }
}
```

### 2.ParseFloatPipe
```JS
// 用于验证和转换请求体中的参数为浮点数
// 如果请求体中的参数无法被转换成浮点数类型，则ParseFloatPipe会抛出BadRequestException异常
@Get('b')
getB(
    @Query('b', new ParseFloatPipe())
    a,
): string {
    return a + 1; // 2.2
}
```

### 3.ParseBoolPipe
```JS
// 用于验证和转换请求体中的参数为布尔类型
// 类型的参数转换成布尔类型时，ParseBoolPipe使用了JavaScript中的弱类型转换。具体来说，它会将"true"、"1"、"yes"、"on"和"y"等字符串转换为true，将"false"、"0"、"no"、"off"和"n"等字符串转换为false，而其它类型的参数则会被转换为空字符串""，然后返回false。
@Get('c')
getC(
    @Query('a', new ParseBoolPipe())
    a,
): string {
    return typeof a;
}
```

### 4.ParseArrayPipe
```JS
// 用于验证和转换请求体中的参数为数组类型
// localhost:3000/d?a=1,2,3

pnpm install -D class-validator class-transformer
// class-validator：用装饰器和非装饰器两种方式对 class 属性做验证的库
// class-transformer：把普通对象转换为对应的 class 实例的包

@Get('d')
getD(
    @Query('a', new ParseArrayPipe({}))
    a: Array<number>,
) {
    return a.reduce((total, item) => total + item, 0); // 0,1,2,3
}

// 发现它并没有转化成Number类型，所以返回了0123
// 这时候就需要用 new XxxPipe 的方式传入参数了
@Get('d')
getD(
    @Query(
        'a',
        new ParseArrayPipe({
            items: Number,
        }),
    )
    a: Array<number>,
) {
    return a.reduce((total, item) => total + item, 0); // 6
}

// 此外，你还可以指定分隔符
// 如果不传参的时候会报错，可以设置为optional
// // localhost:3000/d?a=1..2..3
@Get('f')
getF(
    @Query(
        'a',
        new ParseArrayPipe({
            separator: '..',
            optional: true,
        }),
    )
    a: Array<string>,
) {
    return a;
}
```

### 5.ParseEnumPipe
```JS
// 用于验证和转换请求体中的参数为枚举类型
// localhost:3000/g/444
enum PATHENUM {
    AAA = '111',
    BBB = '222',
    CCC = '333',
}

// ParseEnumPipe({
//     enum: PATHENUM,
//     errorHttpStatusCode: 422, // 参数验证失败时返回的HTTP状态码，默认为400
//     exceptionFactory: () => new CustomException('invalid color'), // 参数验证失败时触发的异常生成函数
// })

@Get('g/:enum')
    getG(
    @Param('enum', new ParseEnumPipe(PATHENUM))
    e: PATHENUM,
) {
    return e;
}
```

### 6.ParseUUIDPipe
```JS
// 用于验证和转换请求体中的参数为UUID类型
// UUID 是一种随机生成的几乎不可能重复的字符串，可以用来做 id
// 如果请求体中的参数无法被转换成UUID类型，则ParseUUIDPipe会抛出BadRequestException异常
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require('uuid');
console.log(uuid.v4()); // 这样会生成一个v4的uuid


@Get('h/:uuid')
    getH(
    @Param('uuid', new ParseUUIDPipe())
    uuid: string,
) {
    return uuid;
}
```

### 7.DefaultValuePipe
```JS
// 这个是设置参数默认值的，当你没传参数的时候，会使用默认值:
@Get('i')
getI(
    @Query('iii', new DefaultValuePipe('123'))
    iii: string,
) {
    return iii;
}
```

### 以上都是Get参数。如果用POST参数，阁下应该如何应对？

### 8.ValidationPipe
```JS
// post 请求的数据是通过 @Body 装饰器来取，并且要有一个 dto class 来接收,
// 用于在处理请求数据之前验证请求数据，并在失败时返回400 Bad Request响应
pnpm install -D class-validator class-transformer

// ./dto/create-aaa.dto
export class CreateAaaDto {
    name: string;
}

import {
    Controller,
    Post,
} from '@nestjs/common';
import { AaaService } from './aaa.service';
import { CreateAaaDto } from './dto/create-aaa.dto';

@Controller('aaa')
export class AaaController {
    constructor(private readonly aaaService: AaaService) {}

    @Post()
    create(@Body() createAaaDto: CreateAaaDto) {
        console.log(createAaaDto);
    }
}

// 然后在 @Body 里添加这个Validationpipe：
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ValidationPipe,
} from '@nestjs/common';
import { AaaService } from './aaa.service';
import { CreateAaaDto } from './dto/create-aaa.dto';

@Controller('aaa')
export class AaaController {
    constructor(private readonly aaaService: AaaService) {}

    @Post()
    create(@Body(new ValidationPipe()) createAaaDto: CreateAaaDto) {
        console.log(createAaaDto);
    }
}
// 在 dto 这里，用 class-validator 包的 @IsInt 装饰器标记一下：
import { IsInt } from 'class-validator';
export class CreateAaaDto {
    name: string;
    @IsInt()
    age: number;
}

// class-validator 都支持的验证方式
import { Contains, IsDate, IsEmail, IsFQDN, IsInt, Length, Max, Min } from 'class-validator';

export class Ppp {
    @Length(10, 20)
    title: string;
  
    @Contains('hello')
    text: string;
  
    @IsInt()
    @Min(0)
    @Max(10)
    rating: number;
  
    @IsEmail()
    email: string;
  
    @IsFQDN()
    site: string;
}

```

### 9.ParseFilePipe
```JS
// 用于解析上传文件的信息，并将其添加到请求体中。您可以在Controller中使用ParseFilePipe来处理上传文件，并且可以将上传文件的信息解析为合适的格式
// 在讲ParseFilePipe之前，我们先来做个文件上传的功能。
// 我们需要实现单文件和多文件上传的功能。
// 首先需要安装一个 multer 的 ts 类型的包：
npm install --save @nestjs/platform-express multer @types/multer

import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AaaService } from './aaa.service';
import { CreateAaaDto } from './dto/create-aaa.dto';

@Controller('aaa')
export class AaaController {
    constructor(private readonly aaaService: AaaService) {}

    @Post('file')
    @UseInterceptors(
        FileInterceptor('aaa', {
            dest: 'uploads',
        }),
    )
    uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1000 }), // 限制大小
                    new FileTypeValidator({ fileType: 'image/jpeg' }), // 限制类型
                ]
            }),
        )
        file: Express.Multer.File,
        @Body() body,
    ) {
        console.log('body', body);
        console.log('file', file);
    }
}


// 上传文件的 html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
  </head>
  <body>
    <input id="fileInput" type="file" multiple />
    <script>
      const fileInput = document.querySelector('#fileInput');

      async function formData() {
        const data = new FormData();
        data.set('name', '朽木白');
        data.set('age', 18);
        data.set('aaa', fileInput.files[0]);

        const res = await axios.post('http://localhost:3000/aaa/file', data);
        console.log(res);
      }

      fileInput.onchange = formData;
    </script>
  </body>
</html>
npx http-server
```

