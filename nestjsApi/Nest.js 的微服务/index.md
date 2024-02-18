### 微服务
随着功能的越来越多，比如现在有一百多个模块了，总不能都放在一个服务里吧，这样管理不方便。
于是就有了拆分的需求，也就有了微服务的概念

之前是启 http 服务，现在是起微服务了嘛，所以启动方式不一样
启动的时候指定用 TCP 来传输消息，然后指定 TCP 启动的端口为 8888
main.js
```TS
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    	AppModule,
      	{
        	transport: Transport.TCP,
        	options: {
          		port: 8888,
        	}
      	}
    );
    app.listen();
}
bootstrap();
```

这里用 MessagePattern 的方式来声明处理啥消息
### app.controller.ts
```TS
import { Controller, Inject, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
	constructor() {}

    @MessagePattern('sum')
    sum(numArr: Array<number>): number {
        return numArr.reduce((total, item) => total + item, 0);
	}
}
```
这个 sum 方法就是接受 sum 消息，返回求和的结果的 handler
然后同样是 yarn start 把这个微服务跑起来：

### app.module.ts
```TS
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
				name: 'CALC_SERVICE',
				transport: Transport.TCP,
				options: {
					port: 8888
				}
			}
		])
	  ],
  	controllers: [AppController],
  	providers: [],
})
export class AppModule {}
```
这样就注册完了

### app.controller.ts
在 Controller 里注入这个微服务的 clientProxy，也就是客户端代理
```TS
import { Controller, Inject, Get, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
	constructor(@Inject('CALC_SERVICE') private calcClient: ClientProxy) {}

    @Get()
	calc(@Query('num') str): Observable<number> {
		const numArr = str.split(',').map((item) => parseInt(item));

		return this.calcClient.send('sum', numArr)
	}
}
```
这样就可以接收到 http 请求的时候调用微服务来处理了。
比如上面我们在收到请求的时候，调用代理对象的 send 方法发了一个 TCP 消息给微服务。
这也是为啥叫做 ClientProxy 了，不用你自己发 TCP 消息，你只要调用 send 方法即可。
然后把它重新跑起来

### 其实微服务还有一种消息传输的类型，这里我们需要响应，所以是 message 的方式，如果不需要响应，那就可以直接声明 event 的方式
我们再来创建个微服务，用来打印日志
Controller 改一下
```TS
import { Controller, Get } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
	constructor() {}

    @EventPattern('log')
    log(text: string): void {
        console.log(text);
	}
}
```
这里不需要响应，只是处理事件，所以不用 MessagePattern 注册消息了，用 EventPattern
然后在 main 项目里注册下：

### app.module.ts
```TS
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
				name: 'LOG_SERVICE',
				transport: Transport.TCP,
				options: {
					port: 9999
				}
			}
		])
	  ],
  	controllers: [AppController],
  	providers: [],
})
export class AppModule {}
```
名字叫做 LOG_SERVICE，端口 9999。
然后在 Controller 里注入这个微服务的 clientProxy：

```TS
import { Controller, Inject, Get, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
	constructor(
		@Inject('CALC_SERVICE') private calcClient: ClientProxy,
		@Inject('LOG_SERVICE') private logClient: ClientProxy // 这行是修改
	) {}

    @Get()
	calc(@Query('num') str): Observable<number> {
		const numArr = str.split(',').map((item) => parseInt(item));

		this.logClient.emit('log', 'calc:' + numArr); // 这行是修改

		// 这里调用微服务
		return this.calcClient.send('sum', numArr)
	}
}
```
这样我们在这个 http 请求的 handler 里同时用到了两个微服务：
用 calc 微服务来做计算，用 log 微服务来记录日志。
yarn start 重跑一下

### 重点
把 http 请求改为 tcp 请求哪些插件也需要换
比如 import * as cookieParser from 'cookie-parser'; 
需要改成 
import * as cookieParserMiddleware from 'cookie-parser-middleware';
看下代码
```TS
import { createServer } from 'http';
import { createMicroservice, MicroserviceOptions } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import * as cookieParserMiddleware from 'cookie-parser-middleware';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
			transport: Transport.TCP,
			options: {
				port: 8888
			}
		}
	)

	// 创建一个HTTP服务器，并在其中使用' cookieParserMiddleware '
	const httpServer = createServer();
	httpServer.use(cookieParserMiddleware());

	// 将创建的HTTP服务器传递给' IoAdapter '，并在应用中使用它
	app.useWebSocketAdapter(new IoAdapter(httpServer));

	await app.listen();
};
bootstrap();
```

### 跨域
由于 @nestjs/microservices 不是基于HTTP协议运行的，它不支持跨域请求。但是，如果您需要在 @nestjs/microservices 中支持跨域请求
将一个面向HTTP的网关代理到 @nestjs/microservices 应用程序之前。使用网关，您可以实现跨域请求的处理、API版本管理、身份验证等功能，并转发请求到 @nestjs/microservices 应用程序
```TS
import { createServer } from 'http';
import { createMicroservice, MicroserviceOptions } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import * as cookieParserMiddleware from 'cookie-parser-middleware';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import * as cors from 'cors';


async function bootstrap() {
	// 跨域
	const server = express(); // 新增代码
  	server.use(cors()); // 新增代码

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
			transport: Transport.TCP,
			options: {
				port: 8888
			}
		}
	)

	// 创建一个HTTP服务器，并在其中使用' cookieParserMiddleware '
	const httpServer = createServer();
	httpServer.use(cookieParserMiddleware());

	// 将创建的HTTP服务器传递给' IoAdapter '，并在应用中使用它
	app.useWebSocketAdapter(new IoAdapter(httpServer));

	await app.listen();
};
bootstrap();
```

### 使用工具文档
使用 Docusaurus JSDoc 等,扫描您的代码并从文本注释中提取信息，生成 API 文档。这些工具可以接受各种标记格式，并生成HTML、PDF等格式的文档
在内部使用或向第三方提供 @nestjs/microservices 服务时，您可以构建一个文档中心，其中包含有关如何使用这些服务的文件和信息。文档中心可以由现成的应用程序开发框架创建，例如Docusaurus、VuePress等

### 如何使用 JSDoc 注释来生成API文档的示例：
```TS
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * @description AppController class to provide basic root service
 */
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	/**
	 * @description Get a basic welcome message
	 * @returns {string} A welcome message
	 */
	@Get()
	getHello(): string {
		return this.appService.getHello();
	}
}
```
使用了 JSDoc 注释来记录AppController类的作用，以及getHello()方法的作用和返回类型。您可以使用VSCode等现代编辑器，来显示这些注释
使用 compodoc 软件可以根据代码中的注释生成文档，compodoc 是一个基于 JSDoc + Markdown 构建的文档生成工具。一旦您的代码中定期使用 JSDoc 注释记录您的代码，并使用 compodoc 生成文档，您就可以方便地将文档保持与代码的同时更新
```TS
npm install -g @compodoc/compodoc
compodoc -p tsconfig.json
```

### @compodoc/compodoc 工具生成 HTML 格式的API文档
代码中使用 JSDoc 对您的 Controller、Method 和参数进行注释
在项目根目录下运行以下命令，它将扫描您的代码并生成 html 格式的文档：
```TS
compodoc -p tsconfig.json
```
生成文档后，您可以在 /documentation 目录下找到它们。打开 index.html 文件以查看生成的文档
```TS
"compilerOptions": {
	"emitDecoratorMetadata": true,
	"experimentalDecorators": true
}
```
这将确保您的 Controller 和 Method 上的装饰器以及参数被 compodoc 确切识别和记录。

这是一个示例，使用 compodoc 工具生成API文档的方法，但是您可以根据需要自定义注释，并将 compodoc 配置为生成目标格式（如 PDF，JSON 等）

### 提供静态文件
在根目录下创建一个public目录，并将您的静态文件放置在其中
```TS
npm install @nestjs/platform-express express
```
在 main.ts 文件中创建Express应用程序：
```TS
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  	const server = express();
  	server.use(express.static(join(__dirname, '..', 'public')));

  	const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    	logger: console,
  	});
  	await app.listen(3000);
}
bootstrap();

// 访问静态文件
// http://localhost:3000/your-static-file-name.jpg
```
如果没有使用与 express 等库相似的“应用程序”和“响应”对象，则无法使用 useStaticAssets 如果您需要在您的应用程序中提供多个静态资产，请使用 express.static 中间件来提供它们

安装依赖
```TS
npm install @nestjs/platform-express express
```
在 main.ts 文件中引入 ExpressAdapter
```TS
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  	const app = await NestFactory.create(
    	AppModule,
    	new ExpressAdapter(),
  	);

  	// Register your public directory as a static folder
  	app.useStaticAssets(join(__dirname, '..', 'public'));

  	await app.listen(3000);
}
bootstrap();

// 访问静态文件
// http://localhost:3000/your-static-file-name.jpg
```

