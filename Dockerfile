### 基于 node 构建项目

#下载node镜像
FROM node
#拷贝当前node项目文件夹下所有文件到镜像的/root/wwwroot下
COPY . /root/wwwroot/
#进入镜像/root/wwwroot文件夹下,安装对应的依赖
WORKDIR /root/wwwroot/
#对外暴露的端口
EXPOSE 3000
#安装依赖:通过npm安装依赖时,有时会报错,这时可以通过安装cnpm来安装依赖
RUN npm install
#启动程序
CMD [ "npm", "start" ]
