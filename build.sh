#!/usr/bin/env bash
#!/bin/sh

# 这个命令告诉 shell 如果任何命令的执行结果不是 true（成功）则应该退出。这样可以防止错误继续执行导致更严重的问题
set -e
# 这个命令告诉 shell 执行命令时显示命令及其参数的详细信息。这可以帮助调试 shell 脚本
set -x
# 这个命令输出文本信息，告诉用户正在构建镜像
echo 'build start'
# 这个命令显示当前日期和时间
date
# 这个命令输出文本信息，告诉用户正在清理构建过程中生成的文件
echo 'clean build node_modules end'
# 这个命令设置 npm 的 registry 为指定的地址。一种常见的用法是将 npm registry 切换为国内的淘宝镜像源，以加速 npm 包的安装
# npm config set registry 'https://registry.npm.taobao.org'
# 这个命令输出文本信息，告诉用户正在执行 npm install 命令
echo 'npm install start'
# 这行命令会运行 npm install 命令，即安装 package.json 文件中列出的所有依赖包
npm install --registry=https://registry.npm.taobao.org
# 这个命令输出文本信息，告诉用户 npm install 命令执行结束
echo 'npm install end'
# 这个命令输出文本信息，告诉用户正在构建指定类型的应用。$1 是一个变量，表示用户在构建 Docker 镜像时传入的参数，用于指定应用的类型
echo "build:$1 start"
# 这个命令会运行 npm run build: 加上用户传入的参数 $1 所表示的字符串，比如 npm run build:prod。这个命令的目的是打包构建应用程序
npm run build:$1; 
# 这个命令输出文本信息，告诉用户构建指定类型的应用已结束
echo "build:$1 end"
# 这个命令显示当前日期和时间
date
# 这个命令输出文本信息，告诉用户构建指定类型的应用已结束
echo "build:$1 end"

