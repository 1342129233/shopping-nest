
### Docker 支持重启策略，是否还需要 PM2
```JS
// 构建镜像
docker build -t restart_test:first .

// 在当前目录下，根据 222.Dockerfile 文件，构建一个名为 restart-test，标签为 second 的 Docker 镜像
// docker build：这是 Docker 的一个命令，用于根据 Dockerfile 构建新的 Docker 镜像。
// -t restart-test:second：-t 参数用于给新的镜像指定一个名字和标签。在这个例子中，新的镜像的名字是 restart-test，标签是 second。
// -f 222.Dockerfile：-f 参数用于指定 Dockerfile 的名字和路径。在这个例子中，Dockerfile 的名字是 222.Dockerfile。
// .：这个参数指定了 Dockerfile 文件和构建上下文的位置。. 表示当前目录。构建上下文是 Docker 构建镜像时可以访问的文件和目录
docker build -t restart-test:second -f 222.Dockerfile .

// 运行容器
docker run --name=restart-test-container restart_test:first

// 指定重启
docker run -d --restart=always --name=restart-test-container2 restart_test:first

// 从名为 restart-test，标签为 second 的 Docker 镜像创建并启动一个新的容器，这个容器的名字是 restart-test-container3，并在后台运行
// docker run：这是 Docker 的一个命令，用于从 Docker 镜像创建并启动一个新的容器。
// -d：这个参数表示以“分离”模式运行容器，也就是在后台运行。
// --name=restart-test-container3：--name 参数用于给新的容器指定一个名字。在这个例子中，新的容器的名字是 restart-test-container3。
// restart-test:second：这是要运行的 Docker 镜像的名字和标签。在这个例子中，镜像的名字是 restart-test，标签是 second
docker run -d --name=restart-test-container3 restart-test:second
```

### restart
```JS
// docker的重启策略

// https://docs.docker.com/engine/reference/commandline/run/#restart
// no 默认是不会自动重启的
// always
// on-failure 非正常退出 还可以指定次数
// unless-stopped 手动

// 健康度检查 health-check
```

Dockerfile 和 222.Dockerfile
```JS
// Dockerfile
FROM node:18-alpine3.14
WORKDIR /app
COPY ./index.js .
CMD ["node", "/app/index.js"]

// 222.Dockerfile
FROM node:18-alpine3.14
WORKDIR /app
COPY ./index.js .
RUN npm install -g pm2
// # 使用pm2来启动
CMD ["pm2-runtime", "/app/index.js"]

```
