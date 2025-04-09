#!/bin/bash

# 进入指定目录
cd /home/fwh/github/nextjs-template-15 || { echo "切换目录失败"; exit 1; }

# 拉取最新代码
git pull || { echo "Git pull失败"; exit 1; }

# 删除 node_modules 和 .next 目录
rm -rf node_modules .next

# 安装依赖
pnpm install || { echo "依赖安装失败"; exit 1; }
pnpm run build || { echo "构建失败"; exit 1; }
# 检查并杀掉占用3002端口的进程
if command -v fuser >/dev/null 2>&1; then
    echo "正在检查3002端口..."
    fuser -k 3002/tcp >/dev/null 2>&1
    echo "端口已释放"
fi

# 后台启动项目
echo "正在启动项目..."
nohup pnpm run start -p 3002 > app.log 2>&1 &

echo "项目已在后台启动,日志写入app.log"