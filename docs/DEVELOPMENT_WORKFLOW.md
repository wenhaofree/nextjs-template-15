# Development Workflow / 开发工作流程

## Overview / 概述

This document outlines the development workflow, coding standards, testing procedures, and contribution guidelines for the ShipSaaS project.

本文档概述了 ShipSaaS 项目的开发工作流程、编码标准、测试程序和贡献指南。

## Development Environment Setup / 开发环境设置

### Required Tools / 必需工具

- **VS Code** with recommended extensions / 带推荐扩展的 VS Code
- **Node.js 18.17+** and **pnpm 8.0+**
- **Git** for version control / 用于版本控制
- **PostgreSQL** or **MySQL** for database / 用于数据库

### Recommended VS Code Extensions / 推荐的 VS Code 扩展

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "prisma.prisma",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Project Structure Understanding / 项目结构理解

```
src/
├── app/                    # Next.js App Router / Next.js 应用路由
│   ├── [locale]/          # Internationalized pages / 国际化页面
│   ├── api/               # API routes / API 路由
│   └── globals.css        # Global styles / 全局样式
├── components/            # React components / React 组件
│   ├── ui/               # Base UI components / 基础 UI 组件
│   ├── sections/         # Page sections / 页面区块
│   └── blocks/           # Reusable blocks / 可重用区块
├── lib/                  # Utility libraries / 工具库
├── hooks/                # Custom React hooks / 自定义 React 钩子
├── types/                # TypeScript types / TypeScript 类型
├── constants/            # Application constants / 应用常量
└── i18n/                 # Internationalization / 国际化
```

## Coding Standards / 编码标准

### TypeScript Guidelines / TypeScript 指南

1. **Always use TypeScript / 始终使用 TypeScript**
```typescript
// ✅ Good - Explicit types / 好 - 明确类型
interface UserProps {
  name: string;
  email: string;
  isActive: boolean;
}

// ❌ Bad - Any types / 坏 - Any 类型
function processUser(user: any) {
  // ...
}
```

2. **Use proper interface definitions / 使用适当的接口定义**
```typescript
// ✅ Good - Well-defined interface / 好 - 定义良好的接口
interface ComponentProps {
  /** User's display name / 用户显示名称 */
  title: string;
  /** Optional subtitle / 可选副标题 */
  subtitle?: string;
  /** Click handler / 点击处理器 */
  onClick: (event: React.MouseEvent) => void;
}
```

### React Component Standards / React 组件标准

1. **Use functional components with hooks / 使用带钩子的函数组件**
```typescript
// ✅ Good - Functional component / 好 - 函数组件
export function UserCard({ name, email }: UserProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="user-card">
      {/* Component content */}
    </div>
  );
}
```

2. **Follow naming conventions / 遵循命名约定**
```typescript
// ✅ Good - PascalCase for components / 好 - 组件使用 PascalCase
export function UserProfile() {}

// ✅ Good - camelCase for functions / 好 - 函数使用 camelCase
const handleUserClick = () => {};

// ✅ Good - UPPER_CASE for constants / 好 - 常量使用 UPPER_CASE
const API_ENDPOINTS = {
  USERS: '/api/users',
  ORDERS: '/api/orders'
};
```

3. **Use proper prop destructuring / 使用适当的属性解构**
```typescript
// ✅ Good - Destructured props / 好 - 解构属性
export function Button({ variant, size, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }))} {...props}>
      {children}
    </button>
  );
}
```

### CSS and Styling Standards / CSS 和样式标准

1. **Use Tailwind CSS classes / 使用 Tailwind CSS 类**
```typescript
// ✅ Good - Tailwind classes / 好 - Tailwind 类
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">

// ❌ Bad - Inline styles / 坏 - 内联样式
<div style={{ display: 'flex', padding: '16px' }}>
```

2. **Use conditional classes properly / 正确使用条件类**
```typescript
// ✅ Good - Using cn utility / 好 - 使用 cn 工具
<button className={cn(
  "px-4 py-2 rounded-md",
  variant === "primary" && "bg-blue-500 text-white",
  variant === "secondary" && "bg-gray-200 text-gray-800",
  disabled && "opacity-50 cursor-not-allowed"
)}>
```

3. **Follow responsive design patterns / 遵循响应式设计模式**
```typescript
// ✅ Good - Mobile-first responsive / 好 - 移动优先响应式
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

## Git Workflow / Git 工作流程

### Branch Naming Convention / 分支命名约定

```bash
# Feature branches / 功能分支
feature/user-authentication
feature/payment-integration

# Bug fix branches / 错误修复分支
fix/login-redirect-issue
fix/payment-validation

# Hotfix branches / 热修复分支
hotfix/security-patch
hotfix/critical-bug

# Release branches / 发布分支
release/v1.2.0
```

### Commit Message Format / 提交消息格式

Follow conventional commits specification:
遵循约定式提交规范：

```bash
# Format / 格式
<type>(<scope>): <description>

# Examples / 示例
feat(auth): add Google OAuth integration
fix(payment): resolve Stripe webhook validation
docs(api): update API documentation
style(ui): improve button component styling
refactor(db): optimize user query performance
test(auth): add login flow tests
```

### Development Process / 开发流程

1. **Create feature branch / 创建功能分支**
```bash
git checkout -b feature/new-feature
```

2. **Make changes with proper commits / 进行适当的提交更改**
```bash
git add .
git commit -m "feat(component): add new user dashboard"
```

3. **Keep branch updated / 保持分支更新**
```bash
git fetch origin
git rebase origin/main
```

4. **Push and create PR / 推送并创建 PR**
```bash
git push origin feature/new-feature
# Create Pull Request on GitHub
```

## Testing Procedures / 测试程序

### Unit Testing / 单元测试

```bash
# Run all tests / 运行所有测试
pnpm test

# Run specific test file / 运行特定测试文件
pnpm test UserCard.test.tsx

# Run tests in watch mode / 在监视模式下运行测试
pnpm test --watch
```

### Database Testing / 数据库测试

```bash
# Run database tests / 运行数据库测试
pnpm test:db

# Run with Docker (recommended) / 使用 Docker 运行（推荐）
pnpm test:db:docker

# Setup test database / 设置测试数据库
pnpm test:db:setup
```

### Integration Testing / 集成测试

```bash
# Test API endpoints / 测试 API 端点
pnpm test:api

# Test authentication flow / 测试认证流程
pnpm test:auth

# Test payment integration / 测试支付集成
pnpm test:payment
```

### Manual Testing Checklist / 手动测试清单

Before submitting PR, verify:
提交 PR 前，请验证：

- [ ] All pages load correctly / 所有页面正确加载
- [ ] Authentication works (login/logout) / 认证工作正常（登录/登出）
- [ ] Responsive design on mobile/tablet / 移动/平板响应式设计
- [ ] Dark/light theme switching / 深色/浅色主题切换
- [ ] Language switching (EN/ZH) / 语言切换（英文/中文）
- [ ] Payment flow (if applicable) / 支付流程（如适用）
- [ ] No console errors / 无控制台错误

## Code Review Process / 代码审查流程

### PR Requirements / PR 要求

1. **Clear description / 清晰描述**
   - What changes were made / 进行了哪些更改
   - Why the changes were necessary / 为什么需要这些更改
   - How to test the changes / 如何测试更改

2. **Code quality checks / 代码质量检查**
```bash
# Lint code / 代码检查
pnpm lint

# Type check / 类型检查
pnpm type-check

# Format code / 格式化代码
pnpm format
```

3. **Documentation updates / 文档更新**
   - Update relevant documentation / 更新相关文档
   - Add JSDoc comments for new functions / 为新函数添加 JSDoc 注释
   - Update README if needed / 如需要更新 README

### Review Checklist / 审查清单

Reviewers should check:
审查者应检查：

- [ ] Code follows project standards / 代码遵循项目标准
- [ ] Proper TypeScript types / 适当的 TypeScript 类型
- [ ] Component documentation / 组件文档
- [ ] Test coverage / 测试覆盖率
- [ ] Performance considerations / 性能考虑
- [ ] Security implications / 安全影响
- [ ] Accessibility compliance / 无障碍合规性

## Deployment Process / 部署流程

### Development Deployment / 开发部署

```bash
# Build for production / 为生产构建
pnpm build

# Start production server locally / 本地启动生产服务器
pnpm start

# Test production build / 测试生产构建
pnpm preview
```

### Staging Deployment / 预发布部署

1. **Merge to staging branch / 合并到预发布分支**
```bash
git checkout staging
git merge feature/new-feature
git push origin staging
```

2. **Verify staging environment / 验证预发布环境**
   - Test all functionality / 测试所有功能
   - Performance testing / 性能测试
   - Cross-browser testing / 跨浏览器测试

### Production Deployment / 生产部署

1. **Create release PR / 创建发布 PR**
```bash
git checkout -b release/v1.2.0
# Update version numbers
# Update CHANGELOG.md
git commit -m "chore: prepare release v1.2.0"
```

2. **Deploy to production / 部署到生产**
   - Merge to main branch / 合并到主分支
   - Tag release / 标记发布
   - Monitor deployment / 监控部署

## Performance Guidelines / 性能指南

### Code Optimization / 代码优化

1. **Use React.memo for expensive components / 对昂贵组件使用 React.memo**
```typescript
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  // Component logic
});
```

2. **Implement proper loading states / 实现适当的加载状态**
```typescript
const [isLoading, setIsLoading] = useState(false);

if (isLoading) {
  return <LoadingSpinner />;
}
```

3. **Optimize images / 优化图片**
```typescript
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority
  placeholder="blur"
/>
```

### Bundle Optimization / 包优化

```bash
# Analyze bundle size / 分析包大小
pnpm build
pnpm analyze

# Check for unused dependencies / 检查未使用的依赖
npx depcheck
```

## Security Guidelines / 安全指南

### Environment Variables / 环境变量

```bash
# ✅ Good - Prefix client variables / 好 - 为客户端变量添加前缀
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...

# ❌ Bad - Server secrets without prefix / 坏 - 没有前缀的服务器密钥
STRIPE_PRIVATE_KEY=sk_test_...  # This should NOT have NEXT_PUBLIC_
```

### Input Validation / 输入验证

```typescript
// ✅ Good - Validate all inputs / 好 - 验证所有输入
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const result = schema.safeParse(input);
if (!result.success) {
  throw new Error('Invalid input');
}
```

### API Security / API 安全

```typescript
// ✅ Good - Authenticate API routes / 好 - 认证 API 路由
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // API logic
}
```

## Contribution Guidelines / 贡献指南

### Getting Started / 开始

1. Fork the repository / Fork 仓库
2. Clone your fork / 克隆您的 fork
3. Create feature branch / 创建功能分支
4. Make changes / 进行更改
5. Submit pull request / 提交拉取请求

### Code of Conduct / 行为准则

- Be respectful and inclusive / 尊重和包容
- Provide constructive feedback / 提供建设性反馈
- Follow project guidelines / 遵循项目指南
- Help others learn and grow / 帮助他人学习和成长

### Getting Help / 获取帮助

- Check documentation first / 首先查看文档
- Search existing issues / 搜索现有问题
- Ask in Discord community / 在 Discord 社区询问
- Create detailed issue reports / 创建详细的问题报告

---

**Remember / 记住**: Quality over speed. Take time to write clean, maintainable code.
质量胜过速度。花时间编写干净、可维护的代码。
