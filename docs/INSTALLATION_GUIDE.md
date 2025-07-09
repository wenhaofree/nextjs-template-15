# Installation Guide / 安装指南

## Overview / 概述

This comprehensive guide will walk you through setting up the ShipSaaS project from scratch, including all dependencies, environment configuration, and deployment options.

本综合指南将引导您从头开始设置 ShipSaaS 项目，包括所有依赖项、环境配置和部署选项。

## Prerequisites / 环境要求

### System Requirements / 系统要求

- **Operating System / 操作系统**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 18.17.0 or higher / 18.17.0 或更高版本
- **Package Manager / 包管理器**: pnpm 8.0+ (recommended) / pnpm 8.0+（推荐）
- **Database / 数据库**: PostgreSQL 13+ or MySQL 8.0+ / PostgreSQL 13+ 或 MySQL 8.0+
- **Git**: Latest version / 最新版本

### Development Tools / 开发工具

- **Code Editor / 代码编辑器**: VS Code (recommended) / VS Code（推荐）
- **Terminal / 终端**: Any modern terminal with shell support
- **Browser / 浏览器**: Chrome, Firefox, Safari, or Edge (latest versions)

## Step-by-Step Installation / 分步安装

### 1. Clone the Repository / 克隆仓库

```bash
# Clone the repository / 克隆仓库
git clone https://github.com/wenhaofree/nextjs-template-15.git

# Navigate to project directory / 进入项目目录
cd nextjs-template-15

# Check the current branch / 检查当前分支
git branch
```

### 2. Install Node.js and pnpm / 安装 Node.js 和 pnpm

#### Option A: Using Node Version Manager (Recommended) / 选项 A：使用 Node 版本管理器（推荐）

```bash
# Install nvm (Linux/macOS) / 安装 nvm（Linux/macOS）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or source profile / 重启终端或加载配置文件
source ~/.bashrc

# Install and use Node.js 18 / 安装并使用 Node.js 18
nvm install 18
nvm use 18

# Install pnpm globally / 全局安装 pnpm
npm install -g pnpm@latest
```

#### Option B: Direct Installation / 选项 B：直接安装

```bash
# Download and install Node.js from https://nodejs.org
# 从 https://nodejs.org 下载并安装 Node.js

# Install pnpm / 安装 pnpm
npm install -g pnpm@latest

# Verify installations / 验证安装
node --version  # Should be 18.17.0+ / 应该是 18.17.0+
pnpm --version  # Should be 8.0+ / 应该是 8.0+
```

### 3. Install Project Dependencies / 安装项目依赖

```bash
# Install all dependencies / 安装所有依赖
pnpm install

# Verify installation / 验证安装
pnpm list --depth=0
```

**Troubleshooting Dependencies / 依赖问题排查:**

```bash
# Clear pnpm cache if installation fails / 如果安装失败，清除 pnpm 缓存
pnpm store prune

# Remove node_modules and reinstall / 删除 node_modules 并重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check for peer dependency issues / 检查对等依赖问题
pnpm install --shamefully-hoist
```

### 4. Database Setup / 数据库设置

#### Option A: PostgreSQL (Recommended) / 选项 A：PostgreSQL（推荐）

**Local Installation / 本地安装:**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Windows - Download from https://www.postgresql.org/download/windows/
```

**Create Database / 创建数据库:**

```bash
# Connect to PostgreSQL / 连接到 PostgreSQL
sudo -u postgres psql

# Create database and user / 创建数据库和用户
CREATE DATABASE shipsaas_db;
CREATE USER shipsaas_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE shipsaas_db TO shipsaas_user;
\q
```

#### Option B: Cloud Database / 选项 B：云数据库

**Supabase (Recommended for beginners) / Supabase（推荐初学者）:**

1. Visit [supabase.com](https://supabase.com) / 访问 [supabase.com](https://supabase.com)
2. Create a new project / 创建新项目
3. Copy the database URL from Settings > Database / 从设置 > 数据库复制数据库 URL

**Railway:**

1. Visit [railway.app](https://railway.app) / 访问 [railway.app](https://railway.app)
2. Create PostgreSQL service / 创建 PostgreSQL 服务
3. Copy connection string / 复制连接字符串

### 5. Environment Configuration / 环境配置

#### Create Environment File / 创建环境文件

```bash
# Copy example environment file / 复制示例环境文件
cp .env.example .env.local

# Edit the file with your preferred editor / 用您喜欢的编辑器编辑文件
nano .env.local  # or code .env.local for VS Code
```

#### Required Environment Variables / 必需的环境变量

```bash
# Database Configuration / 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Authentication / 认证
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: OAuth Providers / 可选：OAuth 提供商
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Optional: Stripe Payment / 可选：Stripe 支付
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_PRIVATE_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### Generate Secure Secrets / 生成安全密钥

```bash
# Generate NEXTAUTH_SECRET / 生成 NEXTAUTH_SECRET
openssl rand -base64 32

# Or use online generator / 或使用在线生成器
# https://generate-secret.vercel.app/32
```

### 6. Database Migration / 数据库迁移

```bash
# Generate Prisma client / 生成 Prisma 客户端
pnpm db:generate

# Push database schema / 推送数据库架构
pnpm db:push

# Verify database connection / 验证数据库连接
pnpm db:studio
```

**Troubleshooting Database Issues / 数据库问题排查:**

```bash
# Check database connection / 检查数据库连接
pnpm prisma db pull

# Reset database if needed / 如需要重置数据库
pnpm prisma db push --force-reset

# View database in browser / 在浏览器中查看数据库
pnpm db:studio
```

### 7. OAuth Setup (Optional) / OAuth 设置（可选）

#### Google OAuth / Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com) / 访问 [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing / 创建新项目或选择现有项目
3. Enable Google+ API / 启用 Google+ API
4. Create OAuth 2.0 credentials / 创建 OAuth 2.0 凭据
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

#### GitHub OAuth / GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps / 访问 GitHub 设置 > 开发者设置 > OAuth 应用
2. Create a new OAuth App / 创建新的 OAuth 应用
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env.local`

### 8. Stripe Setup (Optional) / Stripe 设置（可选）

1. Create account at [stripe.com](https://stripe.com) / 在 [stripe.com](https://stripe.com) 创建账户
2. Get API keys from Dashboard > Developers > API keys / 从仪表板 > 开发者 > API 密钥获取 API 密钥
3. Set up webhook endpoint: `http://localhost:3000/api/stripe/webhook`
4. Copy keys to `.env.local`

### 9. Start Development Server / 启动开发服务器

```bash
# Start the development server / 启动开发服务器
pnpm dev

# The application will be available at / 应用程序将在以下地址可用
# http://localhost:3000
```

### 10. Verify Installation / 验证安装

1. **Homepage / 首页**: Visit `http://localhost:3000` / 访问 `http://localhost:3000`
2. **Authentication / 认证**: Test login/signup functionality / 测试登录/注册功能
3. **Database / 数据库**: Check Prisma Studio at `http://localhost:5555` / 在 `http://localhost:5555` 检查 Prisma Studio
4. **API / API**: Test API endpoints / 测试 API 端点

## Common Issues and Solutions / 常见问题和解决方案

### Port Already in Use / 端口已被使用

```bash
# Find process using port 3000 / 查找使用端口 3000 的进程
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process / 终止进程
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port / 或使用不同端口
pnpm dev -- --port 3001
```

### Database Connection Issues / 数据库连接问题

```bash
# Test database connection / 测试数据库连接
pnpm prisma db pull

# Check if database service is running / 检查数据库服务是否运行
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS
```

### Module Not Found Errors / 模块未找到错误

```bash
# Clear cache and reinstall / 清除缓存并重新安装
rm -rf node_modules pnpm-lock.yaml .next
pnpm install
pnpm dev
```

### TypeScript Errors / TypeScript 错误

```bash
# Regenerate Prisma client / 重新生成 Prisma 客户端
pnpm db:generate

# Check TypeScript configuration / 检查 TypeScript 配置
pnpm tsc --noEmit
```

## Next Steps / 下一步

1. **Customize Content / 自定义内容**: Update messages in `/messages/` directory
2. **Styling / 样式**: Modify Tailwind configuration and components
3. **Features / 功能**: Add new pages and API routes
4. **Testing / 测试**: Run tests with `pnpm test:db`
5. **Deployment / 部署**: Follow deployment guide for production

## Getting Help / 获取帮助

- **Documentation / 文档**: Check `/docs` directory for detailed guides
- **Issues / 问题**: Report bugs on GitHub Issues
- **Community / 社区**: Join our Discord server for support
- **Email / 邮箱**: Contact support@shipsaas.com for enterprise support

---

**Congratulations! / 恭喜！** Your ShipSaaS development environment is now ready. / 您的 ShipSaaS 开发环境现在已准备就绪。
