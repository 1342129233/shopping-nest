### 快速掌握 Nginx 的 2 大核心用法
```JS
// 静态资源 反向代理
// https://www.bilibili.com/video/BV1yS4y1N76R/
```

### 应用场景
```JS
// 反向代理 
// 创建一个项目
nest new 64.nest-nginx-app -p pnpm
// 虚拟主机
// 域名解析
// 负载均衡
// 防盗链
// url重定向
// https
```

### 安装 nginx
```JS
// 这个命令的意思是：运行一个名为 myNginx 的 Docker 容器，这个容器基于 nginx 镜像，连接到 opa 网络，将容器的 80 端口映射到主机的 9999 端口，并挂载了三个目录到容器中。
// nginx.conf配置文件 include /etc/nginx/conf.d/*.conf;
// nginx -t // 测试 Nginx 配置文件的语法是否正确。如果配置文件没有问题，这个命令会输出“configuration file /etc/nginx/nginx.conf test is successful”
// nginx -s reload // 用于重新加载 Nginx 配置文件。当你修改了 Nginx 配置文件后，你可以使用这个命令来应用新的配置，而不需要重启 Nginx
docker run -itd \ // 用于运行一个新的 Docker 容器。-itd 参数表示以交互模式运行容器，并在后台运行
  --name myNginx \ // 用于给新的容器指定一个名字，这里的名字是 myNginx
  -p 9999:80 \ // 用于将容器的 80 端口映射到主机的 9999 端口
  -v ~/liuxs/nest_study/nginx_study/html:/usr/share/nginx/html \ // 用于将主机的 ~/liuxs/nest_study/nginx_study/html 目录挂载到容器的 /usr/share/nginx/html 目录
  -v ~/liuxs/nest_study/nginx_study/log:/var/log/nginx \ // 用于将主机的 ~/liuxs/nest_study/nginx_study/log 目录挂载到容器的 /var/log/nginx 目录
  -v ~/liuxs/nest_study/nginx_study/configs:/etc/nginx/conf.d \ // 这个参数用于将主机的 ~/liuxs/nest_study/nginx_study/configs 目录挂载到容器的 /etc/nginx/conf.d 目录
  --privileged=true \ // 这个参数用于给容器提供额外的权限
  --network opa \ // 参数用于将容器连接到 opa 网络
  nginx // 这是要运行的 Docker 镜像的名字

// 拷贝 主要还是拷贝配置文件
docker cp nginx1:/usr/share/nginx/html /Users/liu/liuxs/nest_study/nginx_study/nginx-html

// copy宿主机到容器中的
// docker cp  ~/nginx-html nginx1:/usr/share/nginx/html-xxx
```

### config
```JS
// user nginx;：这个指令设置了 Nginx 服务器运行的用户，这里是 nginx。

// worker_processes auto;：这个指令设置了 Nginx 服务器的工作进程数，auto 表示自动根据可用的 CPU 核心数设置。

// error_log /var/log/nginx/error.log notice;：这个指令设置了错误日志的位置和日志级别，这里的位置是 /var/log/nginx/error.log，级别是 notice。

// pid /var/run/nginx.pid;：这个指令设置了存储主进程 ID 的文件的位置，这里的位置是 /var/run/nginx.pid。

// events { worker_connections 1024; }：这个块设置了每个工作进程的最大连接数，这里是 1024。

// http { ... }：这个块定义了 HTTP 服务器的配置。其中包括 MIME 类型定义、日志格式、访问日志位置、是否开启 sendfile、保持连接的超时时间、是否开启 gzip 压缩，以及包含的其他配置文件。

// 这个配置文件是 Nginx 服务器的基础配置，它可以根据实际需要进行修改。例如，你可以修改 worker_processes 来调整 Nginx 的性能，或者修改 access_log 和 error_log 来改变日志的位置和级别。
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
    
}
```

### default.conf
```JS
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```

### 负载均衡
```JS
// 轮训 默认的
// weight 权重
// ip_hash 根据ip保证每个请求的是同一个服务器 session
// fair 响应时间 需要安装 nginx-upstream-fair 插件
```

