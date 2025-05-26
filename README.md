# NextLaunchPad

NextLaunchPad 是一个基于 Next.js 15 构建的现代化全栈应用框架，采用最新的 React 技术栈，提供完整的企业级开发解决方案。这是一个功能完整的 SaaS 应用模板，包含用户认证、支付系统、国际化、现代化UI组件等企业级功能。

## 🌟 核心特性

- 🚀 **现代化技术栈**: 基于 Next.js 15 和 React 19 RC版本
- ⚡️ **极致性能**: Turbopack 支持，提供极致开发体验
- 🎨 **现代化UI**: Radix UI + Tailwind CSS + Framer Motion 动画
- 🌐 **国际化支持**: 基于 next-intl 的完整国际化方案 (支持中英文)
- 🔐 **多种认证方式**: NextAuth.js v4 支持 Google、GitHub、邮箱密码登录
- 💳 **完整支付系统**: Stripe 支付集成，支持订阅和一次性付款
- 📊 **数据库管理**: Prisma ORM + MySQL/PostgreSQL
- 🔔 **用户体验**: Sonner 提示系统 + SplashCursor 交互效果
- 📱 **响应式设计**: 完全适配移动端和桌面端
- 🧪 **测试覆盖**: 自动化测试方案
- 🎯 **SEO优化**: 完整的元数据和页面优化

## 🛠️ 技术栈

### 核心框架
- **Next.js 15.0.3** - React 全栈框架，支持 App Router
- **React 19.0.0-rc** - 最新的 React 版本
- **TypeScript 5.x** - 类型安全的 JavaScript

### UI 框架与组件
- **Tailwind CSS 3.4.1** - 原子化 CSS 框架
- **Radix UI** - 无障碍的 UI 组件库
  - Accordion, Dialog, Dropdown Menu, Avatar, Badge 等
- **Framer Motion** - 强大的动画库
- **Lucide React** - 现代化图标库
- **Shadcn/ui** - 基于 Radix UI 的组件系统

### 认证与安全
- **NextAuth.js v4** - 完整的认证解决方案
  - Google OAuth 登录
  - GitHub OAuth 登录
  - Google One Tap 登录
  - 邮箱密码登录
- **bcryptjs** - 密码加密

### 支付系统
- **Stripe 17.5.0** - 完整的支付解决方案
  - 一次性付款
  - 订阅付款
  - Webhook 处理
  - 订单管理

### 数据库与ORM
- **Prisma 6.1.0** - 现代化 ORM
- **MySQL/PostgreSQL** - 关系型数据库支持
- **Prisma Studio** - 数据库可视化管理

### 国际化
- **next-intl 3.26.3** - Next.js 国际化解决方案
- 支持中文和英文
- 动态路由本地化

### 开发工具
- **Turbopack** - 极速构建工具
- **ESLint** - 代码质量检查
- **Jest** - 单元测试框架
- **Docker** - 容器化部署

## 📋 环境要求

- **Node.js 18.17+** - JavaScript 运行环境
- **pnpm 8.0+** - 包管理器（推荐）
- **MySQL 8.0+** 或 **PostgreSQL 13+** - 数据库
- **Docker** - 容器化部署（可选）

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/NextLaunchPad.git
cd NextLaunchPad
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

| 变量名 | 说明 | 示例 | 必需 |
|-------|------|------|------|
| **数据库配置** |
| `DATABASE_URL` | 数据库连接URL | `mysql://user:pass@host:3306/db` | ✅ |
| **认证配置** |
| `NEXTAUTH_SECRET` | NextAuth.js 密钥 | `your-secret-key` | ✅ |
| `NEXTAUTH_URL` | 应用URL | `http://localhost:3000` | ✅ |
| **Google OAuth** |
| `AUTH_GOOGLE_ID` | Google OAuth ID | `google-oauth-id` | ❌ |
| `AUTH_GOOGLE_SECRET` | Google OAuth Secret | `google-oauth-secret` | ❌ |
| `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED` | 启用Google登录 | `true` | ❌ |
| `NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED` | 启用Google One Tap | `true` | ❌ |
| **GitHub OAuth** |
| `AUTH_GITHUB_ID` | GitHub OAuth ID | `github-oauth-id` | ❌ |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Secret | `github-oauth-secret` | ❌ |
| `NEXT_PUBLIC_AUTH_GITHUB_ENABLED` | 启用GitHub登录 | `true` | ❌ |
| **Stripe 支付** |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe 公钥 | `pk_test_xxx` | ❌ |
| `STRIPE_PRIVATE_KEY` | Stripe 私钥 | `sk_test_xxx` | ❌ |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook 密钥 | `whsec_xxx` | ❌ |

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

## 📚 功能详解

### 🔐 认证系统

项目支持多种登录方式：

1. **Google OAuth 登录**
   - 配置 `AUTH_GOOGLE_ID` 和 `AUTH_GOOGLE_SECRET`
   - 设置 `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true`

2. **GitHub OAuth 登录**
   - 配置 `AUTH_GITHUB_ID` 和 `AUTH_GITHUB_SECRET`
   - 设置 `NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true`

3. **Google One Tap 登录**
   - 设置 `NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED=true`

4. **邮箱密码登录**
   - 默认启用，支持用户注册和登录

### 💳 支付系统

集成 Stripe 支付，支持：

- **一次性付款**: 单次购买产品或服务
- **订阅付款**: 月付/年付订阅模式
- **Webhook 处理**: 自动处理支付状态变更
- **订单管理**: 完整的订单历史和状态跟踪

### 🌐 国际化

- 支持中文 (`zh`) 和英文 (`en`)
- 动态路由: `/en/...` 和 `/zh/...`
- 自动语言检测
- 完整的翻译文件管理

### 🎨 UI 组件

项目包含丰富的 UI 组件：

- **Header**: 响应式导航栏，支持多语言切换
- **Hero Section**: 带动画的首页横幅，渐变背景效果
- **Feature Sections**: Bento Grid 布局的功能展示
- **Stats Section**: 数据统计展示
- **Pricing Section**: 动态定价表格，支持 Stripe 集成
- **Testimonials**: 用户评价轮播
- **FAQ Section**: 常见问题手风琴
- **CTA Section**: 行动号召区域
- **Footer**: 完整的页脚信息

### 📊 数据库设计

使用 Prisma ORM，包含以下主要模型：

- **User**: 用户信息，支持多种登录方式
- **Order**: 订单信息，关联用户和支付状态
- **Account**: OAuth 账户关联
- **Session**: 用户会话管理

## 🛠️ 可用的脚本命令

### 开发命令
```bash
pnpm dev          # 开发环境启动（使用Turbopack）
pnpm build        # 生产环境构建
pnpm start        # 生产环境启动
pnpm lint         # ESLint 代码检查
```

### 数据库命令
```bash
pnpm db:push      # 推送数据库变更
pnpm db:pull      # 拉取数据库架构
pnpm db:generate  # 生成Prisma Client
pnpm db:studio    # 启动Prisma Studio
pnpm db:sync      # 同步数据库架构
```

### 测试命令
```bash
pnpm test:db            # 运行数据库测试
pnpm test:db:docker     # 使用Docker运行数据库测试
pnpm docker:up          # 启动Docker容器
pnpm docker:down        # 停止Docker容器
```

## 📁 项目结构

```
NextLaunchPad/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # 国际化路由
│   │   │   ├── auth/          # 认证页面
│   │   │   ├── pricing/       # 定价页面
│   │   │   └── page.tsx       # 首页
│   │   ├── api/               # API 路由
│   │   │   ├── auth/          # NextAuth.js 认证
│   │   │   ├── stripe/        # Stripe 支付
│   │   │   └── user/          # 用户相关 API
│   │   ├── actions.ts         # Server Actions
│   │   ├── globals.css        # 全局样式
│   │   └── providers.tsx      # 全局 Provider
│   ├── components/            # React 组件
│   │   ├── sections/          # 页面区块组件
│   │   │   ├── Hero.tsx       # 首页横幅
│   │   │   ├── Feature2.tsx   # 功能展示
│   │   │   ├── Pricing.tsx    # 定价表格
│   │   │   ├── Stats.tsx      # 数据统计
│   │   │   ├── Testimonial.tsx # 用户评价
│   │   │   ├── FAQ.tsx        # 常见问题
│   │   │   └── CTA.tsx        # 行动号召
│   │   ├── ui/                # UI 基础组件
│   │   │   ├── button.tsx     # 按钮组件
│   │   │   ├── bento-grid.tsx # Bento 网格
│   │   │   ├── footer-section.tsx # 页脚
│   │   │   └── splash-cursor.tsx # 光标效果
│   │   ├── Header.tsx         # 导航栏
│   │   └── GoogleOneTapWrapper.tsx # Google One Tap
│   ├── i18n/                  # 国际化配置
│   │   ├── messages/          # 翻译文件
│   │   │   ├── en.json        # 英文翻译
│   │   │   └── zh.json        # 中文翻译
│   │   └── routing.ts         # 路由配置
│   ├── lib/                   # 工具函数
│   │   ├── auth.ts            # 认证配置
│   │   ├── db.ts              # 数据库连接
│   │   ├── stripe.ts          # Stripe 配置
│   │   └── utils.ts           # 通用工具
│   └── types/                 # TypeScript 类型定义
├── prisma/                    # Prisma 配置
│   ├── schema.prisma          # 数据库模型
│   └── migrations/            # 数据库迁移
├── tests/                     # 测试文件
│   ├── db/                    # 数据库测试
│   └── setup.ts               # 测试配置
├── public/                    # 静态资源
├── .env.example               # 环境变量示例
├── docker-compose.yml         # Docker 配置
├── middleware.ts              # Next.js 中间件
└── tailwind.config.ts         # Tailwind 配置
```

## ⚙️ 配置说明

### 数据库配置
- 支持 MySQL 和 PostgreSQL
- 使用 `sslmode=prefer` 进行安全连接
- Prisma ORM 提供类型安全的数据库操作

## 🔌 API 路由

### 认证相关 API
- `GET/POST /api/auth/*` - NextAuth.js 认证端点
- `POST /api/auth/register` - 用户注册
- `GET /api/user/profile` - 获取用户信息

### 支付相关 API
- `POST /api/stripe/create-checkout-session` - 创建支付会话
- `POST /api/stripe/webhook` - Stripe Webhook 处理
- `GET /api/stripe/orders` - 获取订单列表

### 用户相关 API
- `GET /api/user/orders` - 获取用户订单
- `PUT /api/user/profile` - 更新用户信息

## 🎯 使用指南

### 1. 开发新功能
1. 在 `src/components/sections/` 中创建新的页面区块
2. 在 `src/i18n/messages/` 中添加多语言文本
3. 在 `src/app/[locale]/` 中创建新页面
4. 使用 `src/lib/` 中的工具函数

### 2. 添加新的 UI 组件
1. 在 `src/components/ui/` 中创建基础组件
2. 遵循 Radix UI + Tailwind CSS 的设计模式
3. 确保组件支持暗色模式

### 3. 数据库操作
1. 在 `prisma/schema.prisma` 中定义模型
2. 运行 `pnpm db:push` 同步数据库
3. 使用 `src/lib/db.ts` 进行数据库操作

### 认证配置注意事项

### GitHub OAuth认证配置

配置GitHub OAuth登录时，请注意以下关键事项：

1. **GitHub OAuth应用设置**
   - 在GitHub开发者设置页面 (https://github.com/settings/developers) 创建OAuth应用
   - 应用名称设置为您的项目名称，如："NextLaunchPad"
   - Homepage URL必须与环境变量中的`NEXT_PUBLIC_WEB_URL`保持一致

2. **回调URL配置**
   - 回调URL格式：`{您的域名}/api/auth/callback/github`
   - 本地开发环境示例：`http://localhost:3000/api/auth/callback/github`
   - **注意**：`localhost`和`127.0.0.1`在OAuth认证中被视为不同域名，必须精确匹配

3. **环境变量设置**
   ```
   # GitHub认证变量必须正确设置
   AUTH_GITHUB_ID=您的GitHub客户端ID
   AUTH_GITHUB_SECRET=您的GitHub客户端密钥
   NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true

   # NEXTAUTH_URL与GitHub OAuth应用中的域名必须保持一致
   # 如果GitHub OAuth中使用localhost，这里也必须使用localhost
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_WEB_URL=http://localhost:3000
   ```

4. **常见错误处理**
   - `redirect_uri is not associated with this application`：
     - 检查GitHub OAuth应用中的回调URL与实际使用的域名是否完全一致
     - 确保使用相同的域名格式（localhost vs 127.0.0.1）
     - 检查端口号是否匹配
   - `Missing GitHub client ID or secret`：
     - 确保环境变量中正确设置了GitHub认证凭据
     - 检查`AUTH_GITHUB_ID`和`AUTH_GITHUB_SECRET`是否与GitHub OAuth应用一致
   - `outgoing request timed out after 3500ms`（请求超时错误）：
     - 这通常是网络连接问题，而非配置错误
     - 检查您的网络连接是否稳定
     - 如果使用代理或VPN，尝试临时关闭
     - GitHub API可能暂时不可用，稍后再试
     - 如果在中国大陆地区，可能需要配置代理来访问GitHub API
     - 增加NextAuth超时配置（在auth.config.ts中添加`timeout: 10000`将超时延长到10秒）

5. **域名变更时的处理**
   - 当应用域名发生变更时（如从本地开发到生产环境）：
     - 更新GitHub OAuth应用中的回调URL
     - 或创建多个OAuth应用分别用于不同环境

## 数据库测试

项目包含了对数据库连接和表结构的自动化测试方案。

### 测试内容

- 数据库连接测试
- 表结构验证测试
- 字段类型和默认值测试
- 表关系测试
- 软删除功能测试

### 运行测试

使用本地数据库测试:

```bash
pnpm test:db
```

使用Docker独立环境测试（推荐）:

```bash
pnpm test:db:docker
```

这将：
1. 启动Docker容器中的PostgreSQL
2. 执行数据库迁移
3. 运行所有测试用例
4. 自动清理测试环境

## 🚀 部署

### Vercel 部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2FNextLaunchPad&env=DATABASE_URL,NEXTAUTH_SECRET,AUTH_GOOGLE_ID,AUTH_GOOGLE_SECRET,AUTH_GITHUB_ID,AUTH_GITHUB_SECRET,NEXT_PUBLIC_STRIPE_PUBLIC_KEY,STRIPE_PRIVATE_KEY,STRIPE_WEBHOOK_SECRET&project-name=nextlaunchpad&repository-name=nextlaunchpad)

**部署步骤：**

1. **准备工作**
   ```bash
   # Fork 本项目到你的 GitHub 账户
   git clone https://github.com/your-username/NextLaunchPad.git
   ```

2. **在 Vercel 部署**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 导入你的 GitHub 仓库
   - 配置环境变量（见下方列表）
   - 点击 "Deploy"

3. **必需的环境变量**
   ```bash
   # 数据库
   DATABASE_URL=your_database_url

   # 认证
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=https://your-domain.vercel.app

   # OAuth (可选)
   AUTH_GOOGLE_ID=your_google_client_id
   AUTH_GOOGLE_SECRET=your_google_client_secret
   AUTH_GITHUB_ID=your_github_client_id
   AUTH_GITHUB_SECRET=your_github_client_secret

   # Stripe (可选)
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxx
   STRIPE_PRIVATE_KEY=sk_live_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

### Docker 部署

```bash
# 构建镜像
docker build -t nextlaunchpad .

# 运行容器
docker run -p 3000:3000 --env-file .env nextlaunchpad
```

### 自托管部署

```bash
# 构建项目
pnpm build

# 启动生产服务器
pnpm start
```

项目包含完整的测试套件：

### 数据库测试
```bash
# 运行数据库连接和模型测试
pnpm test:db

# 使用 Docker 环境测试（推荐）
pnpm test:db:docker
```

**测试内容包括：**
- 数据库连接测试
- 表结构验证
- 字段类型和约束测试
- 关系模型测试
- 数据操作测试

### 单元测试
```bash
# 运行所有单元测试
pnpm test

# 监听模式运行测试
pnpm test:watch
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献流程
1. **Fork 项目**
   ```bash
   git clone https://github.com/your-username/NextLaunchPad.git
   cd NextLaunchPad
   ```

2. **创建功能分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **开发和测试**
   ```bash
   pnpm dev          # 启动开发服务器
   pnpm test:db      # 运行测试
   pnpm lint         # 检查代码质量
   ```

4. **提交更改**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```

5. **推送并创建 PR**
   ```bash
   git push origin feature/amazing-feature
   ```

### 代码规范
- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 配置的代码规范
- 为新功能添加相应的测试
- 更新相关文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- **项目作者**: WenHaoFree
- **Email**: fuwenhao945@gmail.com
- **GitHub**: [https://github.com/wenhaofree](https://github.com/wenhaofree)

## 🙏 致谢

感谢以下开源项目：
- [Next.js](https://nextjs.org/) - React 全栈框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Radix UI](https://www.radix-ui.com/) - 无障碍 UI 组件
- [Prisma](https://www.prisma.io/) - 现代化 ORM
- [NextAuth.js](https://next-auth.js.org/) - 认证解决方案
- [Stripe](https://stripe.com/) - 支付处理平台

## 🎯 路线图

- [x] ✅ 用户认证系统（多种登录方式）
- [x] ✅ Stripe 支付集成
- [x] ✅ 数据库测试套件
- [x] ✅ 国际化支持
- [x] ✅ 响应式 UI 设计
- [ ] 🔄 管理员后台
- [ ] 🔄 邮件通知系统
- [ ] 🔄 更多支付方式
- [ ] 🔄 移动端 App

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！
