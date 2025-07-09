# ShipSaas

一个基于 Next.js 15 构建的现代化全栈 SaaS 应用模板，具备企业级认证、支付处理、国际化和完整的 UI 组件系统。这个生产就绪的模板提供了快速高效启动 SaaS 产品所需的一切功能。

## 🌟 核心特性

- 🚀 **现代化技术栈**: 基于 Next.js 15、React 19 RC 和 TypeScript 构建
- ⚡️ **极致性能**: Turbopack 支持，提供闪电般的开发体验
- 🎨 **精美 UI**: Radix UI + Tailwind CSS + Framer Motion 动画
- 🌐 **国际化支持**: 基于 next-intl 的完整国际化方案（中英文）
- 🔐 **多种认证方式**: NextAuth.js v4 支持 Google、GitHub、邮箱密码和 Google One Tap 登录
- 💳 **支付集成**: 完整的 Stripe 集成，支持订阅和一次性付款
- 📊 **数据库管理**: Prisma ORM 支持 PostgreSQL/MySQL
- 🔔 **增强用户体验**: Sonner 通知和交互式光标效果
- 📱 **响应式设计**: 完全适配移动端和桌面端
- 🧪 **测试套件**: Jest 综合自动化测试
- 🎯 **SEO 优化**: 完整的元数据和页面优化
- 🐳 **Docker 就绪**: 支持容器化部署

## 🏗️ 架构概览

ShipSaas 遵循现代全栈架构模式：

- **前端**: React 19 配合 Next.js 15 App Router
- **后端**: Next.js API 路由配合服务器操作
- **数据库**: PostgreSQL 配合 Prisma ORM
- **认证**: NextAuth.js 多提供商支持
- **支付**: Stripe 配合 webhook 处理
- **样式**: Tailwind CSS 设计系统
- **状态管理**: React 服务器组件 + 客户端组件
- **国际化**: next-intl 动态路由

## 🛠️ 技术栈

### 核心框架
- **Next.js 15.2.3** - 全栈 React 框架，支持 App Router
- **React 18.2.0** - 现代 React 并发特性
- **TypeScript 5.x** - 类型安全的 JavaScript 开发

### UI 与样式
- **Tailwind CSS 3.4.1** - 实用优先的 CSS 框架
- **Radix UI** - 无障碍、无样式的 UI 组件
  - Accordion、Dialog、Dropdown Menu、Avatar、Tooltip 等
- **Framer Motion 12.6.2** - 生产就绪的动画库
- **Lucide React** - 美观一致的图标库
- **Shadcn/ui** - 基于 Radix UI 构建的可复用组件

### 认证与安全
- **NextAuth.js 4.24.11** - 完整的认证解决方案
  - Google OAuth 集成
  - GitHub OAuth 集成
  - Google One Tap 登录
  - 凭据认证
- **bcryptjs** - 密码哈希和验证

### 支付处理
- **Stripe 17.7.0** - 完整的支付基础设施
  - 一次性付款
  - 订阅计费
  - Webhook 事件处理
  - 订单管理系统

### 数据库与 ORM
- **Prisma 6.6.0** - 下一代 ORM
- **PostgreSQL** - 主要数据库（也支持 MySQL）
- **Prisma Studio** - 可视化数据库管理

### 国际化
- **next-intl 3.26.3** - 类型安全的国际化
- **多语言支持** - 英文和中文
- **动态路由** - 基于语言环境的 URL 结构

### 开发工具
- **Turbopack** - 超快速开发打包器
- **ESLint** - 代码质量和一致性
- **Jest 29.7.0** - JavaScript 测试框架
- **Docker** - 容器化和部署

## 📋 环境要求

- **Node.js 18.17+** - JavaScript 运行环境
- **pnpm 10.10.0+** - 包管理器（推荐）
- **PostgreSQL 13+** 或 **MySQL 8.0+** - 数据库
- **Docker** - 容器化部署（可选）

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/your-username/ShipSaas.git
cd ShipSaas
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 环境配置

```bash
cp .env.example .env.local
```

配置以下环境变量：

| 变量 | 说明 | 示例 | 必需 |
|------|------|------|------|
| **数据库配置** |
| `DATABASE_URL` | 数据库连接 URL | `postgresql://user:pass@host:5432/db` | ✅ |
| **认证配置** |
| `NEXTAUTH_SECRET` | NextAuth.js 密钥 | `your-secret-key` | ✅ |
| `NEXTAUTH_URL` | 应用 URL | `http://localhost:3000` | ✅ |
| **Google OAuth** |
| `AUTH_GOOGLE_ID` | Google OAuth 客户端 ID | `google-oauth-id` | ❌ |
| `AUTH_GOOGLE_SECRET` | Google OAuth 客户端密钥 | `google-oauth-secret` | ❌ |
| `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED` | 启用 Google 登录 | `true` | ❌ |
| `NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED` | 启用 Google One Tap | `true` | ❌ |
| **GitHub OAuth** |
| `AUTH_GITHUB_ID` | GitHub OAuth 客户端 ID | `github-oauth-id` | ❌ |
| `AUTH_GITHUB_SECRET` | GitHub OAuth 客户端密钥 | `github-oauth-secret` | ❌ |
| `NEXT_PUBLIC_AUTH_GITHUB_ENABLED` | 启用 GitHub 登录 | `true` | ❌ |
| **Stripe 支付** |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe 可发布密钥 | `pk_test_xxx` | ❌ |
| `STRIPE_PRIVATE_KEY` | Stripe 私密密钥 | `sk_test_xxx` | ❌ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook 密钥 | `whsec_xxx` | ❌ |

### 4. 数据库设置

```bash
# 拉取数据库架构
pnpm db:pull

# 推送架构变更
pnpm db:push

# 生成 Prisma 客户端
pnpm db:generate

# 或一次性同步所有
pnpm db:sync
```

### 5. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用

## 📚 功能深度解析

### 🔐 认证系统

应用支持多种认证方式：

1. **Google OAuth 登录**
   - 配置 `AUTH_GOOGLE_ID` 和 `AUTH_GOOGLE_SECRET`
   - 设置 `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true`

2. **GitHub OAuth 登录**
   - 配置 `AUTH_GITHUB_ID` 和 `AUTH_GITHUB_SECRET`
   - 设置 `NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true`

3. **Google One Tap 登录**
   - 设置 `NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED=true`
   - 提供无缝认证体验

4. **邮箱/密码认证**
   - 内置用户注册和登录
   - 使用 bcryptjs 进行安全密码哈希

### 💳 支付系统

全面的 Stripe 集成支持：

- **一次性付款**: 单次购买交易
- **订阅计费**: 月付/年付循环付款
- **Webhook 处理**: 自动支付状态更新
- **订单管理**: 完整的订单历史和跟踪
- **多币种支持**: 全球支付处理

### 🌐 国际化

- **多语言支持**: 英文（`en`）和中文（`zh`）
- **动态路由**: 基于语言环境的 URL（`/en/...` 和 `/zh/...`）
- **自动语言检测**: 浏览器偏好检测
- **类型安全翻译**: 完整的翻译文件管理
- **SEO 优化**: 本地化元数据和站点地图生成

### 🎨 UI 组件

丰富的生产就绪组件集合：

- **Header**: 响应式导航栏，支持语言切换
- **Hero Section**: 带动画的着陆页区域，渐变背景
- **Feature Sections**: 功能展示的 Bento Grid 布局
- **Stats Section**: 动画统计数据显示
- **Pricing Section**: 动态定价表格，集成 Stripe
- **Testimonials**: 客户评价轮播
- **FAQ Section**: 可折叠的常见问题
- **CTA Section**: 行动号召区域
- **Footer**: 包含链接和信息的完整页脚

### 📊 数据库架构

使用 Prisma ORM 的核心模型：

- **User**: 支持多提供商认证的用户配置文件
- **Order**: 带支付状态跟踪的订单管理
- **软删除**: 内置软删除功能
- **时间戳**: 自动创建/更新时间戳跟踪

## 🛠️ 可用脚本

### 开发命令
```bash
pnpm dev          # 启动开发服务器（使用 Turbopack）
pnpm build        # 生产环境构建
pnpm start        # 启动生产服务器
pnpm lint         # 运行 ESLint 代码质量检查
```

### 数据库命令
```bash
pnpm db:push      # 推送数据库架构变更
pnpm db:pull      # 拉取数据库架构
pnpm db:generate  # 生成 Prisma 客户端
pnpm db:studio    # 启动 Prisma Studio
pnpm db:sync      # 同步数据库架构（pull + push + generate）
```

### 测试命令
```bash
pnpm test:db            # 运行数据库测试
pnpm test:db:docker     # 使用 Docker 运行数据库测试
pnpm test:db:setup      # 设置测试数据库
pnpm docker:up          # 启动 Docker 容器
pnpm docker:down        # 停止 Docker 容器
```

## 📁 项目结构

```
ShipSaas/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # 国际化路由
│   │   │   ├── auth/          # 认证页面
│   │   │   ├── orders/        # 订单管理页面
│   │   │   ├── profile/       # 用户配置页面
│   │   │   └── page.tsx       # 着陆页
│   │   ├── api/               # API 路由
│   │   │   ├── auth/          # NextAuth.js 端点
│   │   │   ├── stripe/        # Stripe 支付 API
│   │   │   ├── orders/        # 订单管理 API
│   │   │   └── users/         # 用户管理 API
│   │   ├── actions.ts         # 服务器操作
│   │   ├── globals.css        # 全局样式
│   │   └── providers.tsx      # 全局提供者
│   ├── components/            # React 组件
│   │   ├── sections/          # 页面区块组件
│   │   │   ├── Hero.tsx       # 着陆页英雄区块
│   │   │   ├── Feature2.tsx   # 功能展示
│   │   │   ├── Pricing.tsx    # 定价表格
│   │   │   ├── Stats.tsx      # 统计显示
│   │   │   ├── Testimonial.tsx # 客户推荐
│   │   │   ├── FAQ.tsx        # FAQ 手风琴
│   │   │   └── CTA.tsx        # 行动号召
│   │   ├── ui/                # 基础 UI 组件
│   │   │   ├── button.tsx     # 按钮组件
│   │   │   ├── bento-grid.tsx # Bento 网格布局
│   │   │   ├── footer-section.tsx # 页脚组件
│   │   │   └── sheet.tsx      # 抽屉组件
│   │   ├── Header.tsx         # 导航头部
│   │   ├── ThemeToggle.tsx    # 深色/浅色模式切换
│   │   └── GoogleOneTapWrapper.tsx # Google One Tap 集成
│   ├── i18n/                  # 国际化
│   │   ├── locales/           # 语言环境配置
│   │   ├── request.ts         # i18n 请求处理器
│   │   └── routing.ts         # 路由配置
│   ├── lib/                   # 实用函数
│   │   ├── prisma.ts          # 数据库连接
│   │   └── utils.ts           # 通用实用工具
│   ├── tests/                 # 测试文件
│   │   ├── db/                # 数据库测试
│   │   ├── jest.config.js     # Jest 配置
│   │   └── setup.ts           # 测试设置
│   └── types/                 # TypeScript 类型定义
├── messages/                  # 翻译文件
│   ├── en.json                # 英文翻译
│   └── zh.json                # 中文翻译
├── prisma/                    # Prisma 配置
│   └── schema.prisma          # 数据库架构
├── public/                    # 静态资源
├── .env.example               # 环境变量模板
├── docker-compose.yml         # Docker 配置
├── middleware.ts              # Next.js 中间件
└── tailwind.config.ts         # Tailwind CSS 配置
```

## ⚙️ 配置

### 数据库配置
- **PostgreSQL**（主要）和 **MySQL** 支持
- SSL 支持的安全连接
- **Prisma ORM** 类型安全的数据库操作
- 内置连接池和优化

### 认证配置
- **NextAuth.js** 多提供商支持
- **JWT** 和 **session** 策略
- **CSRF** 保护启用
- **安全 cookie** 配置

## 🔌 API 路由

### 认证 API
- `GET/POST /api/auth/*` - NextAuth.js 认证端点
- `POST /api/auth/signup` - 用户注册
- `POST /api/auth/sync-user` - 用户同步

### 支付 API
- `POST /api/stripe` - 创建 Stripe 结账会话
- `POST /api/stripe/webhook` - Stripe webhook 处理器
- `GET /api/orders` - 检索用户订单

### 用户管理 API
- `GET /api/users` - 用户管理端点
- `GET /api/posts` - 内容管理（如适用）

## 🎯 开发指南

### 1. 添加新功能
1. 在 `src/components/sections/` 中创建新的页面区块
2. 在 `messages/en.json` 和 `messages/zh.json` 中添加翻译
3. 在 `src/app/[locale]/` 中创建新页面
4. 利用 `src/lib/` 中的实用函数

### 2. 创建 UI 组件
1. 在 `src/components/ui/` 中添加基础组件
2. 遵循 Radix UI + Tailwind CSS 设计模式
3. 确保深色模式兼容性
4. 包含适当的 TypeScript 类型

### 3. 数据库操作
1. 在 `prisma/schema.prisma` 中定义模型
2. 运行 `pnpm db:push` 同步数据库
3. 使用 `src/lib/prisma.ts` 进行数据库操作
4. 使用 `pnpm db:generate` 生成类型

### 4. 添加认证提供商
1. 在 `src/auth.config.ts` 中配置提供商
2. 添加环境变量
3. 更新新提供商的 UI 组件
4. 测试认证流程

## 🔧 认证设置指南

### GitHub OAuth 配置

设置 GitHub OAuth 认证时，请遵循以下重要步骤：

1. **GitHub OAuth 应用设置**
   - 访问 GitHub 开发者设置 (https://github.com/settings/developers)
   - 使用您的项目名称创建新的 OAuth 应用（例如："ShipSaas"）
   - 设置主页 URL 以匹配您的 `NEXTAUTH_URL` 环境变量

2. **回调 URL 配置**
   - 回调 URL 格式：`{your-domain}/api/auth/callback/github`
   - 本地开发示例：`http://localhost:3000/api/auth/callback/github`
   - **重要**：`localhost` 和 `127.0.0.1` 被视为不同域名

3. **环境变量**
   ```bash
   # GitHub 认证凭据
   AUTH_GITHUB_ID=your-github-client-id
   AUTH_GITHUB_SECRET=your-github-client-secret
   NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true

   # 确保 NEXTAUTH_URL 与您的 GitHub OAuth 应用域名匹配
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **常见问题与解决方案**
   - **`redirect_uri is not associated with this application`**：
     - 验证 GitHub OAuth 应用中的回调 URL 完全匹配
     - 确保一致的域名格式（localhost vs 127.0.0.1）
     - 检查端口号是否匹配

   - **`Missing GitHub client ID or secret`**：
     - 验证环境变量设置正确
     - 确保凭据与 GitHub OAuth 应用设置匹配

   - **请求超时错误**：
     - 通常是网络连接问题
     - 尝试暂时禁用代理/VPN
     - GitHub API 可能暂时不可用
     - 考虑在 `auth.config.ts` 中增加超时时间

5. **多环境设置**
   - 为开发/生产创建单独的 OAuth 应用
   - 或在部署到不同环境时更新回调 URL

## 🧪 测试

项目包含数据库操作和应用逻辑的综合自动化测试。

### 测试覆盖

- **数据库连接测试**：验证数据库连接
- **架构验证测试**：验证表结构和关系
- **字段类型测试**：检查数据类型和约束
- **关系测试**：测试模型关联
- **软删除测试**：验证软删除功能

### 运行测试

**本地数据库测试：**
```bash
pnpm test:db
```

**Docker 环境测试（推荐）：**
```bash
pnpm test:db:docker
```

这将：
1. 在 Docker 容器中启动 PostgreSQL
2. 执行数据库迁移
3. 运行所有测试套件
4. 自动清理测试环境

### 测试配置

- **Jest** 测试框架
- **TypeScript** 支持 ts-jest
- **隔离测试数据库** 安全测试
- **自动设置/清理** 干净的测试运行

## 🚀 部署

### Vercel 部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2FShipSaas&env=DATABASE_URL,NEXTAUTH_SECRET,AUTH_GOOGLE_ID,AUTH_GOOGLE_SECRET,AUTH_GITHUB_ID,AUTH_GITHUB_SECRET,NEXT_PUBLIC_STRIPE_PUBLIC_KEY,STRIPE_PRIVATE_KEY,STRIPE_WEBHOOK_SECRET&project-name=shipsaas&repository-name=shipsaas)

**部署步骤：**

1. **准备工作**
   ```bash
   # Fork 此仓库到您的 GitHub 账户
   git clone https://github.com/your-username/ShipSaas.git
   ```

2. **部署到 Vercel**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 导入您的 GitHub 仓库
   - 配置环境变量（见下方列表）
   - 点击 "Deploy"

3. **必需的环境变量**
   ```bash
   # 数据库
   DATABASE_URL=your_database_url

   # 认证
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=https://your-domain.vercel.app

   # OAuth（可选）
   AUTH_GOOGLE_ID=your_google_client_id
   AUTH_GOOGLE_SECRET=your_google_client_secret
   AUTH_GITHUB_ID=your_github_client_id
   AUTH_GITHUB_SECRET=your_github_client_secret

   # Stripe（可选）
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxx
   STRIPE_PRIVATE_KEY=sk_live_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

### Docker 部署

```bash
# 构建镜像
docker build -t shipsaas .

# 运行容器
docker run -p 3000:3000 --env-file .env shipsaas
```

### 自托管部署

```bash
# 构建项目
pnpm build

# 启动生产服务器
pnpm start
```

### 生产环境数据库设置

1. **设置 PostgreSQL 数据库**（推荐提供商：Supabase、Railway、PlanetScale）
2. **在环境变量中配置 DATABASE_URL**
3. **运行数据库迁移**：
   ```bash
   pnpm db:push
   ```

## 🤝 贡献

我们欢迎各种形式的贡献来改进 ShipSaas！

### 贡献工作流

1. **Fork 仓库**
   ```bash
   git clone https://github.com/your-username/ShipSaas.git
   cd ShipSaas
   ```

2. **创建功能分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **开发与测试**
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

### 代码标准

- **TypeScript**：使用 TypeScript 进行类型安全开发
- **ESLint**：遵循配置的代码检查规则
- **测试**：为新功能添加测试
- **文档**：更新相关文档
- **提交信息**：使用约定式提交格式

### 开发最佳实践

- **组件结构**：遵循既定的组件模式
- **状态管理**：尽可能使用 React 服务器组件
- **性能**：针对核心 Web 指标进行优化
- **无障碍性**：确保组件具有无障碍性
- **国际化**：为新文本内容添加翻译

## 📄 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件。

## 📞 联系方式

- **项目作者**：WenHaoFree
- **邮箱**：fuwenhao945@gmail.com
- **GitHub**：[https://github.com/wenhaofree](https://github.com/wenhaofree)

## 🙏 致谢

特别感谢这些出色的开源项目：

- [Next.js](https://nextjs.org/) - 生产级 React 框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Radix UI](https://www.radix-ui.com/) - 低级 UI 原语
- [Prisma](https://www.prisma.io/) - 下一代 ORM
- [NextAuth.js](https://next-auth.js.org/) - 完整的认证解决方案
- [Stripe](https://stripe.com/) - 支付处理平台
- [Framer Motion](https://www.framer.com/motion/) - 生产就绪的动画库

## 🎯 路线图

- [x] ✅ 多提供商认证系统
- [x] ✅ Stripe 支付集成
- [x] ✅ 综合测试套件
- [x] ✅ 国际化支持
- [x] ✅ 响应式 UI 设计
- [x] ✅ 深色/浅色主题支持
- [ ] 🔄 管理员仪表板
- [ ] 🔄 邮件通知系统
- [ ] 🔄 其他支付提供商
- [ ] 🔄 移动应用
- [ ] 🔄 高级分析
- [ ] 🔄 多租户支持

## 🌟 表达支持

如果这个项目对您有帮助，请考虑：
- ⭐ **给仓库加星**
- 🐛 **报告** 错误和问题
- 💡 **建议** 新功能
- 🤝 **贡献** 代码

---

**由 ShipSaas 团队用 ❤️ 构建**
