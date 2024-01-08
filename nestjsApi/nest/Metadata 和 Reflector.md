### 理解 Nest.js 中的 Metadata 和 Reflector
```JS
// https://juejin.cn/post/7077372768378945573
// Metadata 是通过装饰器来实现的，它包含了对应类、方法、属性和参数等的数据。用于添加自定义的元数据以及与依赖注入有关的信息
@Controller(): 指定一个控制器类，并且可以设置控制器的基本配置
@Injectable(): 指定一个可注入的服务类，并且可以设置该服务的基本配置
@Param(): 将路由参数注入到控制器方法中
@Body(): 将请求体注入到控制器方法中
@Query(): 将查询参数注入到控制器方法中
@Heager(): 将请求头注入到控制器方法中

// Reflector 可以用于检索和解析这些元数据
Reflector.getMetadata(metadataKey: string, target: object)：获取指定目标上的元数据
Reflector.getMetadata(metadataKey: string, target: object, propertyKey: string | symbol)：获取指定目标和属性上的元数据
Reflector.getMetadata(metadataKey: string, target: object, propertyKey: string | symbol, parameterIndex: number)：获取指定目标、属性和参数索引上的元数据

// 案例一 class上添加元数据
import { Controller, Get, ReflectMetadata } from '@nestjs/common';
@Controller('cats')
@ReflectMetadata('roles', ['admin']) // 装饰器来添加自定义的元数据信息
export class CatsController {
    @Get()
    findAll() {
        return 'This action returns all cats';
    }
}

// 使用 Reflector 函数来检索该元数据
import { Reflector } from '@nestjs/core';

const roles = Reflector.getMetadata('roles', CatsController);
console.log(roles); // ['admin']


// 案例二
import 'reflect-metadata';
function classMetadata(key, value) {
    return function(target){
        Reflect.defineMetadata(key, value, target)
    }
}

function methodMetadata(key, value) {
    return function(target, propertyName){
        Reflect.defineMetadata(key, value, target, propertyName)
    }
}

@classMetadata('name', 'laowang')
class Person {
    @methodMetadata('name', 'run so fast')
    skill():string {
        return  '来人就跑！来抓我啊！'
    }
}

console.log(Reflect.getMetadata('name', Person)) // laowang
console.log(Reflect.getMetadata('name', Person.prototype, 'skill')) // run so fast
```

### Module 和 Provider 的循环依赖怎么处理？
```JS
// 解析 BbbModule 时报错
// 第一种是值本来就是 undefined
// 第二种是形成了循环依赖
// 可以使用 forwardRed 将其关联起来

// 案例一 在 module 中循环调用
// aaa.module.ts
import { Module, forwardRed } from '@nestjs/common';
import { BbbModule } from './bbb.module';

@Module({
    import: [forwardRed(() => BbbModule)]
})
export class AaaModule {}

// bbb.module.ts
import { Module, forwardRed } from '@nestjs/common';
import { AaaModule } from './aaa.module';

@Module({
    import: [forwardRed(() => AaaModule)]
})
export class BbbModule {}


// 案例二 在 server 中循环调用
// ccc 和 ddd 的 server 模块循环调用
// aaa.module.ts
import { Module } from '@nestjs/common';

@Module({
    imports: [AaaModule, BbbModule],
    controllers: [AppController],
    providers: [AaaService, CccService, DddService]
})
export class AppModule {
    constructor(
        provider: AaaService,
        cccService: CccService,
        dddService: DddService
    )
}

// CccService
import { Injectable, forwardRed } from '@nestjs/common';
export class CccService {
    constructor(
        @Inject(forwardRed(() => DddService)) private dddService: DddService
    ){}

    eee() {
        return this.dddService.ddd()
    }
}

// DddService
import { Injectable, forwardRed } from '@nestjs/common';
export class DddService {
    constructor(
        @Inject(forwardRed(() => CccService)) private dddService: CccService
    ){}

    eee() {
        return this.dddService.ddd()
    }
}
```

### 如何创建动态模块
```JS
// 简单版本
import { Module } from '@nestjs/common';
import { DynamicModule } from 'nestjs-dynamic';
 
// 使用 DynamicModule 来创建动态模块
@Module({})
export class MyDynamicModule extends DynamicModule {}


// 然后，我们需要定义该模块的配置项、提供者等信息。这些信息将会被注入到应用程序中
import { Provider } from '@nestjs/common';
import { DynamicModule } from 'nestjs-dynamic';
 
const providers: Provider[] = [/* your provider definitions */];
 
@Module({
  imports: [], // 导入其他模块（可选）
  controllers: [], // 控制器列表（可选）
  exports: [], // 导出的提供者列表（可选）
  providers: providers, // 提供者列表
})
class MyDynamicModule implements DynamicModule {
  static forRoot(options?: any): DynamicModule {
    return {
      module: MyDynamicModule,
      global: true, // 全局模块标识符（可选）
      dynamicMetadata: options || {}, // 自定义元数据（可选）
    };
  }
}

// 第二版本 复杂版本的
// 1.创建动态模块提供者
@Module({})
export class DynamicModuleProvider {
    static register(data: any): DynamicModule {
        return {
            module: DynamicModuleProvider,
            providers: [
                {
                provide: 'dynamicData',
                useValue: data,
                },
            ],
        };
    }
}

// 2.创建动态模块工厂类
export class DynamicModuleFactory implements DynamicModule {
    module: Type<any>;
    constructor(private readonly options: any) {
        this.module = options.module;
    }

    static async create(options) {
        const module = await import(options.path);

        const importedModules = options.imports || [];

        const importedProviders = flatten(
            importedModules.map((module) => module.providers)
        );

        const providers = [
            ...importedProviders,
            ...(options.providers || [])
        ];

        const imports = [
            ...(options.imports || []),
            ...(module.imports || [])
        ]

        const dynamicModule = options.dynamicModule || DynamicModuleProvider.register(options.dynamicData);
        imports.push(dynamicModule);

        return {
            ...module,
            module: DynamicModuleFactory,
            imports,
            providers,
        };
    }
}

// 3.使用动态模块
const dynamicModule = await DynamicModuleFactory.create({
    path: './my-module',
    providers: [MyService], // 添加自定义 providders
    imports: [ConfigModule], // 引入其他模块
    dynamicData: {
        myProperty: true,
    }
})
```

### Nest 和 Express 的关系，如何切到 fastify
```JS
// 安装 Fastify：npm install fastify --save

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjsplatform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    await app.listen(3000);
}
bootstrap();
```
