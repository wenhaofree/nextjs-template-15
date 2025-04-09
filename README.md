# TODO:
1. 登陆功能验证，注册功能添加：
2. 支付功能验证；
3. 数据库测试用例


# NextLaunchPad

NextLaunchPad 是一个基于 Next.js 15 构建的现代化全栈应用框架，采用最新的 React 技术栈，提供完整的企业级开发解决方案。

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
- 🧪 自动化测试方案

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

### 测试工具
- Jest 29.7.0
- ts-jest 29.1.1

## 环境要求

- Node.js 18.17 或更高版本
- pnpm 8.0 或更高版本（推荐）
- MySQL 8.0 或更高版本（推荐）
- Docker和Docker Compose（用于测试环境）

## 快速开始

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

# 测试相关命令
pnpm test:db            # 运行数据库测试
pnpm test:db:docker     # 使用Docker运行数据库测试
pnpm docker:up          # 启动Docker容器
pnpm docker:down        # 停止Docker容器

# 运行脚本步骤；-这一个目录就够
pnpm run db:test:init

# 推送架构到测试数据库
pnpm run db:test:push

# 生成Prisma客户端
pnpm run db:generate

# 或一键设置测试环境
pnpm run test:db:setup
# 运行所有数据库测试
pnpm run test:db
# 运行测试调试脚本
pnpm run test:debug

# 启动Prisma Studio查看测试数据库-http://localhost:5555
pnpm run db:test:studio
```

## 认证配置注意事项

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

## 部署

### Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2FNextLaunchPad&env=DATABASE_URL,NEXTAUTH_SECRET,AUTH_GOOGLE_ID,AUTH_GOOGLE_SECRET,AUTH_GITHUB_ID,AUTH_GITHUB_SECRET,STRIPE_PUBLIC_KEY,STRIPE_PRIVATE_KEY,STRIPE_WEBHOOK_SECRET&project-name=nextlaunchpad&repository-name=nextlaunchpad)

1. Fork 本项目
2. 在 Vercel 创建新项目
3. 导入你的 GitHub 仓库
4. 配置环境变量
5. 部署

## 项目结构

```
NextLaunchPad/
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
├── styles/            # 样式文件
└── tests/             # 测试文件目录
    ├── db/            # 数据库测试
    │   ├── connection.test.ts   # 连接测试
    │   └── schema.test.ts       # 表结构测试
    ├── setup.ts       # 测试环境设置
    ├── teardown.ts    # 测试环境清理
    └── jest.config.js # Jest配置
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
