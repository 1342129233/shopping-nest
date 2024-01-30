
### Docker 容器通信的最简单方式：桥接网络
```JS
// docker 网络
// https://dockerdocs.cn/engine/reference/commandline/network/
// 容器的通信
// docker中通过namespace机制实现了容器的隔离 其中就有 network namespace
```

### 网络
```JS

// 1. ip在docker容器重启之后会变化
// 2. 想通过name的方式去访问 Name or service not known

docker network ls
// 创建网络 可以指定subnet
// docker network create --subnet=172.65.0.1/24 opa
docker network create common-network
// 查看
docker network inspect common-network

// 创建容器加入到对应的网络 --network common-network

// 这个命令用于构建 Docker 镜像。-t mmmmm 参数用于给新的镜像指定一个名字（在这个例子中是 mmmmm）。. 指定了 Dockerfile 文件的位置，. 表示当前目录。所以这个命令会在当前目录查找 Dockerfile 文件，并根据这个文件构建一个名为 mmmmm 的 Docker 镜像
docker build -t mmmmm .

// 这个命令用于运行一个 Docker 容器。-itd 参数表示以交互模式运行容器，并在后台运行。--network opa 参数将容器连接到 opa 网络。-p 3001:3000 参数将容器的 3000 端口映射到主机的 3001 端口。--name nest-container2 参数给新的容器指定一个名字（在这个例子中是 nest-container2）。mmmmm 是要运行的 Docker 镜像的名字。所以这个命令会运行一个名为 nest-container2 的 Docker 容器，这个容器基于 mmmmm 镜像，连接到 opa 网络，并将容器的 3000 端口映射到主机的 3001 端口
docker run -itd --network opa -p 3001:3000 --name nest-container2 mmmmm

// 这个命令用于查看 Docker 容器的日志。nest-container2 是要查看日志的 Docker 容器的名字。所以这个命令会显示 nest-container2 容器的日志
docker logs nest-container2
```

### docker compose
```JS
// 可以指定netWorks 不指定也是默认的在同一个中
// 会自动的创建
```