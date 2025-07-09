# Troubleshooting Guide / 故障排除指南

## Overview / 概述

This guide provides solutions to common issues you might encounter while developing with ShipSaaS. Each section includes both English and Chinese explanations.

本指南提供了在使用 ShipSaaS 开发时可能遇到的常见问题的解决方案。每个部分都包含英文和中文说明。

## Installation Issues / 安装问题

### Node.js Version Conflicts / Node.js 版本冲突

**Problem / 问题**: Error messages about unsupported Node.js version / 关于不支持的 Node.js 版本的错误消息

**Solution / 解决方案**:
```bash
# Check current Node.js version / 检查当前 Node.js 版本
node --version

# Install correct version using nvm / 使用 nvm 安装正确版本
nvm install 18.17.0
nvm use 18.17.0

# Verify version / 验证版本
node --version  # Should show v18.17.0 or higher
```

### Package Installation Failures / 包安装失败

**Problem / 问题**: `pnpm install` fails with dependency conflicts / `pnpm install` 因依赖冲突失败

**Solution / 解决方案**:
```bash
# Clear pnpm cache / 清除 pnpm 缓存
pnpm store prune

# Remove lock file and node_modules / 删除锁文件和 node_modules
rm -rf node_modules pnpm-lock.yaml

# Reinstall with legacy peer deps / 使用传统对等依赖重新安装
pnpm install --shamefully-hoist

# Alternative: Use npm if pnpm fails / 替代方案：如果 pnpm 失败则使用 npm
npm install --legacy-peer-deps
```

### Permission Errors / 权限错误

**Problem / 问题**: Permission denied when installing packages / 安装包时权限被拒绝

**Solution / 解决方案**:
```bash
# Fix npm permissions (Linux/macOS) / 修复 npm 权限（Linux/macOS）
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm to avoid permission issues / 或使用 nvm 避免权限问题
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

## Database Issues / 数据库问题

### Connection Failures / 连接失败

**Problem / 问题**: Cannot connect to database / 无法连接到数据库

**Diagnosis / 诊断**:
```bash
# Test database connection / 测试数据库连接
pnpm prisma db pull

# Check database service status / 检查数据库服务状态
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS
```

**Solutions / 解决方案**:

1. **Check DATABASE_URL format / 检查 DATABASE_URL 格式**:
```bash
# Correct format / 正确格式
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# For cloud databases / 对于云数据库
DATABASE_URL="postgresql://user:pass@host.com:5432/dbname?sslmode=require"
```

2. **Start database service / 启动数据库服务**:
```bash
# PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# MySQL
sudo systemctl start mysql       # Linux
brew services start mysql        # macOS
```

3. **Create database if it doesn't exist / 如果数据库不存在则创建**:
```sql
-- Connect to PostgreSQL / 连接到 PostgreSQL
sudo -u postgres psql

-- Create database / 创建数据库
CREATE DATABASE shipsaas_db;
CREATE USER shipsaas_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE shipsaas_db TO shipsaas_user;
```

### Schema Sync Issues / 架构同步问题

**Problem / 问题**: Database schema out of sync / 数据库架构不同步

**Solution / 解决方案**:
```bash
# Reset database (WARNING: This will delete all data) / 重置数据库（警告：这将删除所有数据）
pnpm prisma db push --force-reset

# Or migrate step by step / 或逐步迁移
pnpm prisma db pull
pnpm prisma generate
pnpm prisma db push
```

### Prisma Client Issues / Prisma 客户端问题

**Problem / 问题**: Prisma client not generated or outdated / Prisma 客户端未生成或过时

**Solution / 解决方案**:
```bash
# Regenerate Prisma client / 重新生成 Prisma 客户端
pnpm prisma generate

# Clear Prisma cache / 清除 Prisma 缓存
rm -rf node_modules/.prisma
pnpm prisma generate

# Restart TypeScript server in VS Code / 在 VS Code 中重启 TypeScript 服务器
# Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

## Development Server Issues / 开发服务器问题

### Port Already in Use / 端口已被使用

**Problem / 问题**: Error: Port 3000 is already in use / 错误：端口 3000 已被使用

**Solution / 解决方案**:
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

### Hot Reload Not Working / 热重载不工作

**Problem / 问题**: Changes not reflected automatically / 更改未自动反映

**Solution / 解决方案**:
```bash
# Clear Next.js cache / 清除 Next.js 缓存
rm -rf .next

# Restart development server / 重启开发服务器
pnpm dev

# Check file watchers limit (Linux) / 检查文件监视器限制（Linux）
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Build Errors / 构建错误

**Problem / 问题**: Build fails with TypeScript or ESLint errors / 构建因 TypeScript 或 ESLint 错误失败

**Solution / 解决方案**:
```bash
# Check TypeScript errors / 检查 TypeScript 错误
pnpm tsc --noEmit

# Fix ESLint issues / 修复 ESLint 问题
pnpm lint --fix

# Skip type checking during build (not recommended for production) / 构建时跳过类型检查（不推荐用于生产）
# Add to next.config.mjs:
typescript: { ignoreBuildErrors: true }
```

## Authentication Issues / 认证问题

### NextAuth Configuration / NextAuth 配置

**Problem / 问题**: Authentication not working / 认证不工作

**Solution / 解决方案**:

1. **Check environment variables / 检查环境变量**:
```bash
# Required variables / 必需变量
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

2. **Verify OAuth configuration / 验证 OAuth 配置**:
```bash
# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# GitHub OAuth
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

3. **Check callback URLs / 检查回调 URL**:
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

### Session Issues / 会话问题

**Problem / 问题**: User session not persisting / 用户会话不持久

**Solution / 解决方案**:
```bash
# Clear browser cookies and localStorage / 清除浏览器 cookie 和 localStorage
# In browser console / 在浏览器控制台中:
localStorage.clear();
# Then manually clear cookies for localhost

# Check database for session storage / 检查数据库中的会话存储
pnpm db:studio
# Look for Session and Account tables
```

## Payment Integration Issues / 支付集成问题

### Stripe Configuration / Stripe 配置

**Problem / 问题**: Stripe payments not working / Stripe 支付不工作

**Solution / 解决方案**:

1. **Verify Stripe keys / 验证 Stripe 密钥**:
```bash
# Test mode keys / 测试模式密钥
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_PRIVATE_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

2. **Test webhook endpoint / 测试 webhook 端点**:
```bash
# Install Stripe CLI / 安装 Stripe CLI
# https://stripe.com/docs/stripe-cli

# Forward events to local server / 将事件转发到本地服务器
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

3. **Check webhook configuration / 检查 webhook 配置**:
- Endpoint URL: `http://localhost:3000/api/stripe/webhook`
- Events: `checkout.session.completed`, `payment_intent.succeeded`

## Performance Issues / 性能问题

### Slow Page Loads / 页面加载缓慢

**Problem / 问题**: Application loads slowly / 应用程序加载缓慢

**Solution / 解决方案**:

1. **Enable Turbopack / 启用 Turbopack**:
```bash
# Use Turbopack for faster development / 使用 Turbopack 进行更快的开发
pnpm dev --turbo
```

2. **Optimize images / 优化图片**:
```jsx
// Use Next.js Image component / 使用 Next.js Image 组件
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority // For above-the-fold images / 对于首屏图片
/>
```

3. **Check bundle size / 检查包大小**:
```bash
# Analyze bundle / 分析包
pnpm build
pnpm start

# Use bundle analyzer / 使用包分析器
npm install -g @next/bundle-analyzer
```

### Memory Issues / 内存问题

**Problem / 问题**: High memory usage or out of memory errors / 高内存使用或内存不足错误

**Solution / 解决方案**:
```bash
# Increase Node.js memory limit / 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"

# Or add to package.json scripts / 或添加到 package.json 脚本中
"dev": "NODE_OPTIONS='--max-old-space-size=4096' next dev"
```

## Deployment Issues / 部署问题

### Vercel Deployment / Vercel 部署

**Problem / 问题**: Deployment fails on Vercel / 在 Vercel 上部署失败

**Solution / 解决方案**:

1. **Check environment variables / 检查环境变量**:
- All required variables are set in Vercel dashboard
- NEXTAUTH_URL matches your domain
- Database URL is accessible from Vercel

2. **Build settings / 构建设置**:
```bash
# Build command / 构建命令
pnpm build

# Install command / 安装命令
pnpm install

# Node.js version / Node.js 版本
18.x
```

3. **Database connection / 数据库连接**:
```bash
# Ensure database allows external connections / 确保数据库允许外部连接
# For cloud databases, check firewall settings / 对于云数据库，检查防火墙设置
```

## Getting Additional Help / 获取额外帮助

### Debug Mode / 调试模式

Enable debug logging for more detailed error information:
启用调试日志记录以获取更详细的错误信息：

```bash
# Enable debug mode / 启用调试模式
DEBUG=* pnpm dev

# Or specific modules / 或特定模块
DEBUG=prisma:* pnpm dev
```

### Log Files / 日志文件

Check application logs for detailed error information:
检查应用程序日志以获取详细的错误信息：

```bash
# Development logs / 开发日志
# Check browser console and terminal output

# Production logs / 生产日志
# Check Vercel function logs or server logs
```

### Community Support / 社区支持

- **GitHub Issues**: Report bugs and request features / 报告错误和请求功能
- **Discord**: Join our community for real-time help / 加入我们的社区获取实时帮助
- **Documentation**: Check `/docs` for detailed guides / 查看 `/docs` 获取详细指南
- **Email Support**: contact@shipsaas.com for enterprise customers / 企业客户请联系 contact@shipsaas.com

---

**Remember / 记住**: Always backup your data before making significant changes to your database or configuration.
在对数据库或配置进行重大更改之前，请始终备份您的数据。
