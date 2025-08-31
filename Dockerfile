# 使用Node.js 18作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装所有依赖（包括dev依赖，用于构建）
RUN npm ci

# 复制应用代码
COPY . .

# 设置环境变量默认值
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# 根据环境选择对应的env文件
RUN if [ "$NODE_ENV" = "production" ]; then \
        cp .env.production .env.local; \
    else \
        cp .env.development .env.local; \
    fi

# 构建Next.js应用（跳过类型检查）
RUN npm run build -- --no-lint

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]