### docker-compose.yml 文件
```yml
services:
    nest-app:
        container_name: nest-app
        build:
            context: ./
            dockerfile: ./Dockerfile
        depends_on:
            - mysql-container
            - redis-container
        ports:
            - '3000:3000'
    mysql-container:
        container_name: mysql_container
        image: mysql
        ports:
            - '3306:3306'
        environment:
            - MYSQL_ALLOW_EMPTY_PASSWORD=true
            - MYSQL_ROOT_PASSWORD=root
        volumes:
            - /Users/liu/liuxs/nest_study/mysql-data:/var/lib/mysql
    redis-container:
        container_name: redis_container
        image: redis
        ports:
            - '6379:6379'
        volumes:
            - /Users/liu/liuxs/nest_study/redis-data:/data
```

### Dockerfile 文件
```JS
# FROM node:18 as build-stage
# 我们一般都会采用 alpine和分阶段的

# 缓存的问题
# docker builder prune
# docker system prune -a --volumes

# 1. build stage 构建阶段

FROM node:18.0-alpine3.14 as build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

COPY . .

RUN npm run build

# 2. production stage 生成阶段

FROM node:18.0-alpine3.14 as production-stage

# 将上一个阶段的内容copy过来
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

# 这里为什么又要安装一次 这样会不会导致 install的时间很长
# 这里只会安装 dependencies的依赖
RUN npm install --production

COPY --from=build-stage /app/dist /app

EXPOSE 3000

CMD ["node", "/app/main.js"]


# docker build -t nest:0.2 -f 02.Dockerfile .
# docker run -itd -p 3001:3000  --name nest02 nest:0.2


# Jenkins 配合gitee的流水线 Gitee Go
# https://gitee.com/help/categories/69 注意命令空间 https://gitee.com/profile
# https://juejin.cn/post/7130895772664463368
# https://juejin.cn/post/6920181050362740750
# 编辑流水线 任务编排 镜像构建 编辑任务
# GITEE_DOCKER_IMAGE
# jenkins gitlab

# 推送到 阿里云仓库中
# https://cr.console.aliyun.com/repository/cn-hangzhou/ishopee/nest-demo/details


# docker tag nest:0.2 registry.cn-hangzhou.aliyuncs.com/ishopee/nest-demo:nest0.2

# docker push registry.cn-hangzhou.aliyuncs.com/ishopee/nest-demo:nest0.2


# docker build -t nest:v1 .
# docker run -d -p 3000:3000 --network opa --name nest-container nest:v1
```

### 为什么要使用 Docker Compose ？
容器编排
容器的部署顺序 依赖关系 多服务
微服务 多个中间件
这些命令是在 Linux 系统中安装 Docker Compose 的步骤

#### 1.基础
```JS
// docker compose 多服务部署 docker编排
// 负责对 docker 容器集群的快速编排的
// 自定义一个配置文件 docker-compose.yml
// 规定多个容器之间的调用关系 一个命令就可以同时启动和关闭这些容器
// 容器的启动顺序 调用关系 等等

// 安装
// 1.x 是 docker-compose的命令
// 这个命令用于检查 Docker Compose 是否已经安装，以及安装的版本号
docker compose version
// https://docs.docker.com/compose/install/
// https://docs.docker.com/compose/compose-file/compose-file-v3/

// 这个命令用于安装 EPEL 仓库。EPEL（Extra Packages for Enterprise Linux）是为企业级 Linux 提供额外软件包的仓库，包括 CentOS、RHEL 等
yum -y install epel-release
// 这个命令用于安装 pip。pip 是 Python 的包管理器，用于安装和管理 Python 软件包
yum -y install python-pip
// 这个命令用于清理 yum 的缓存。这可以帮助节省磁盘空间，并且可以避免由于缓存导致的问题
yum clean all
// 这个命令用于通过 pip 安装 Docker Compose
pip install docker-compose
// 这个命令用于从 GitHub 下载 Docker Compose 的二进制文件，并将其保存到 /usr/local/bin/docker-compose。这个命令中的 $(uname -s)-$(uname -m) 会被替换为你的操作系统和硬件架构，以确保下载正确的版本
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
// 添加可执行权限
sudo chmod +x /usr/local/bin/docker-compose
// 查看版本信息
docker-compose -version

// 核心概念
// 一文件: docker-compose.yml
// 两个要素: 服务(容器)和工程(多个容器服务实例)

// 1. 编写 Dockerfile 文件 构建出对应的镜像文件
// 2. 使用 docker-compose 编写整体应用中的各个容器服务
// 3. docker compose up 启动整个应用程序
// sentry ./install.sh
```

#### 2.架构
```JS
// docker是一个 c/s 模型的架构 后端是一个松耦合的架构  多个模块自己干自己的
// 运行流程
// 1. 用户使用 client 与 docker daemon建立通信 发送请求给 daemon
// 2. daemon 作为 docker 结构的主体 提供 docker server 接受 client 的请求
// 3. docker  engine 执行docker内的一系列工作 每一个都是一个job
// 4. job运行过程 需要镜像就从 docker registry中下载 通过管理 graph driver 通过 graph 形式存储
// 5. 当需要创建网络环境 通过网络管理去懂 network driver 见配置docker容器网络环境
// 6. 需要限制容器运行资源或执行用户执行 通过 exec driver 来完成
// 7. lib container是一项独立的容器管理包

// network driver 和 exec driver 都是通过 lib container 来实现具体对容器的操作
```


#### 3.常见命令
```JS
// 会创建默认的网络

// docker-compose up	       启动所有的服务
// docker-compose up -d	   后台启动所有的服务
// docker-compose ps	       打印所有的容器
// docker-compose stop	     停止所有服务
// docker-compose logs -f	 持续跟踪日志
// docker-compose exec nginx1 bash	进入nginx1服务系统
// docker-compose rm nginx1	删除服务容器
// docker network ls	       查看网络网络不会删除
// docker-compose down	     删除所有的网络和容器
```

#### 3.常见命令
```JS
version: "3"
services:
  nginx1:
    image: nginx
    ports:
      - "8081:80"
    networks:
      - "opa"
    volumes:
      - "data:/data"
      - "./nginx1:/usr/share/nginx/html"
  nginx2:
    image: nginx
    ports:
      - "8082:80"
    networks:
      - "default"
    volumes:
      - "data:/data"
      - "./nginx2:/usr/share/nginx/html"
  nginx3:
    image: nginx
    ports:
      - "8083:80"
    networks:
      - "default"
      - "opa"
    volumes:
      - "data:/data"
      - "./nginx3:/usr/share/nginx/html"
# networks 指定自定义网络
networks:
  opa:
    driver: bridge
# volumes 指定数据卷
volumes:
  data:
    driver: local
```

#### 容器监控
```JS
// CAdvisor+InfluxDB+Granfana
// 容器监控
// CAdvisor 监控收集 监控 默认存储2分钟的 redis kafka es
// 内置了对 Prometheus 的支持
// influxDB 存储数据 持久化数据
// granfana 展示图表

// 使用 docker-compose 容器编排 -d 表示后台启动
docker compose up
// docker compose up -d

// cAdvisor 8089 数据收集
localhost:8089
// influxdb 8083
localhost:8083
// grafana 5000 admin / admin
localhost:5000

// 添加 panel
// 1. add dataSource
http://influxdb:8086
// 2. add dashboard
// 3. 配置监控业务规则
```

#### 部署
```JS
nest new 60.docker-compose-test -p pnpm

// 生成一个user的资源
nest g resource user --no-spec
```