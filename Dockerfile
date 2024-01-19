### 基于 node 构建项目

# #下载node镜像
# FROM node:21.2.0
# # 使用 yarn 安装依赖
# # RUN apt-get update && \
# #     apt-get -y install curl gnupg && \
# #     curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
# #     echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
# #     apt-get update && \
# #     apt-get -y install yarn

# WORKDIR /app
# #拷贝package.json文件到镜像的/app下
# COPY package.json /app/package.json
# # RUN npm config set registry 'http://npm.corp.kuaishou.com'
# RUN npm install -g npm@6.14.13
# RUN npm install
# COPY . /app
# CMD ["npm", "start"]

FROM node:21.2.0
WORKDIR /usr/project-nest
COPY . .
RUN npm install -g npm@6.14.13
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
