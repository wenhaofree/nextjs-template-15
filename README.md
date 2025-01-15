# NextSphere

NextSphere 是一个基于 Next.js 15 构建的现代化全栈应用框架，采用最新的 React 技术栈，提供完整的企业级开发解决方案。

## 核心特性

- 🚀 基于 Next.js 15 和 React 19 RC版本
- ⚡️ Turbopack 支持，提供极致开发体验
- 🎨 Radix UI + Tailwind CSS 构建的现代化UI
- 🌐 基于 next-intl 的国际化方案
- 🔐 NextAuth.js v4 实现的身份认证
- 💳 Stripe 支付系统集成
- 📊 Prisma ORM 数据库管理
- 🔔 Sonner 提示系统
- 📱 响应式设计

## 技术栈

### 核心框架
- Next.js 15.0.3
- React 19.0.0-rc
- TypeScript 5.x

### UI框架
- Tailwind CSS 3.4.1
- Radix UI Components
  - Accordion
  - Dialog
  - Dropdown Menu
  - Slot
- Lucide React (图标)

### 状态管理与工具
- next-intl 3.26.3 (国际化)
- next-auth 4.24.11 (认证)
- Stripe 17.5.0 (支付)
- date-fns 4.1.0 (日期处理)
- UUID 11.0.4

### 数据库
- Prisma 6.1.0
- Prisma Client

## 环境要求

- Node.js 18.17 或更高版本
- pnpm 8.0 或更高版本（推荐）
- MySQL 8.0 或更高版本（推荐）

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/NextSphere.git
cd NextSphere
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 环境变量配置

```bash
cp .env.example .env.local
```

配置以下环境变量：

| 变量名 | 说明 | 示例 |
|-------|------|------|
| DATABASE_URL | 数据库连接URL | mysql://user:pass@host:3306/db |
| NEXTAUTH_SECRET | NextAuth.js 密钥 | your-secret-key |
| AUTH_GOOGLE_ID | Google OAuth ID | google-oauth-id |
| AUTH_GOOGLE_SECRET | Google OAuth Secret | google-oauth-secret |
| AUTH_GITHUB_ID | GitHub OAuth ID | github-oauth-id |
| AUTH_GITHUB_SECRET | GitHub OAuth Secret | github-oauth-secret |
| STRIPE_PUBLIC_KEY | Stripe 公钥 | pk_test_xxx |
| STRIPE_PRIVATE_KEY | Stripe 私钥 | sk_test_xxx |
| STRIPE_WEBHOOK_SECRET | Stripe Webhook 密钥 | whsec_xxx |

### 4. 数据库初始化

```bash
# 拉取数据库架构
pnpm db:pull

# 推送架构变更
pnpm db:push

# 生成Prisma Client
pnpm db:generate

# 或者一键同步
pnpm db:sync
```

### 5. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用

## 可用的脚本命令

```bash
# 开发环境启动（使用Turbopack）
pnpm dev

# 生产环境构建
pnpm build

# 生产环境启动
pnpm start

# ESLint 代码检查
pnpm lint

# Prisma 数据库操作
pnpm db:push     # 推送数据库变更
pnpm db:pull     # 拉取数据库架构
pnpm db:generate # 生成Prisma Client
pnpm db:studio   # 启动Prisma Studio
pnpm db:sync     # 同步数据库架构
```


## 项目结构

```
NextSphere/
├── app/                # Next.js 应用目录
│   ├── api/           # API 路由
│   ├── [locale]/      # 国际化路由
│   └── layout.tsx     # 根布局
├── components/         # React 组件
│   ├── ui/            # UI 组件
│   └── shared/        # 共享组件
├── lib/               # 工具函数
├── prisma/            # Prisma 配置
├── public/            # 静态资源
└── styles/            # 样式文件
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目作者：[WenHaoFree]
- Email：[fuwenhao945@gmail.com]
- GitHub：[https://github.com/wenhaofree]
