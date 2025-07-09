# 📁 项目目录结构说明

## 🎯 优化后的标准Next.js 15目录结构

```
shipsaas/
├── 📁 src/                           # 源代码目录
│   ├── 📁 app/                       # App Router (Next.js 13+)
│   │   ├── 📁 [locale]/              # 国际化路由
│   │   │   ├── 📁 auth/              # 认证相关页面
│   │   │   │   ├── 📁 signin/        # 登录页面
│   │   │   │   └── layout.tsx        # 认证布局
│   │   │   ├── 📁 orders/            # 订单管理页面
│   │   │   ├── 📁 profile/           # 用户资料页面
│   │   │   ├── layout.tsx            # 国际化布局
│   │   │   └── page.tsx              # 首页
│   │   ├── 📁 api/                   # API路由
│   │   │   ├── 📁 auth/              # 认证API
│   │   │   ├── 📁 orders/            # 订单API
│   │   │   └── 📁 payments/          # 支付API
│   │   ├── globals.css               # 全局样式文件
│   │   ├── layout.tsx                # 根布局组件
│   │   ├── providers.tsx             # 全局Providers
│   │   ├── theme.css                 # 主题样式
│   │   └── favicon.ico               # 网站图标
│   ├── 📁 components/                # React组件
│   │   ├── 📁 ui/                    # 基础UI组件 (shadcn/ui)
│   │   ├── 📁 layout/                # 布局相关组件
│   │   ├── 📁 sections/              # 页面区块组件
│   │   └── 📁 blocks/                # 可复用区块组件
│   ├── 📁 lib/                       # 工具库和配置
│   ├── 📁 hooks/                     # 自定义React Hooks
│   ├── 📁 types/                     # TypeScript类型定义
│   ├── 📁 constants/                 # 常量定义
│   ├── 📁 i18n/                      # 国际化配置
│   ├── 📁 global.d.ts                # TypeScript类型声明
│   ├── 📁 __tests__/                 # 测试文件 (优化后位置)
│   │   ├── 📁 db/                    # 数据库测试
│   │   ├── jest.config.js            # Jest配置
│   │   └── setup.ts                  # 测试设置
│   └── auth.config.ts                # 认证配置
├── 📁 messages/                      # 翻译文件 (官方标准位置)
│   ├── en.json                       # 英文翻译
│   └── zh.json                       # 中文翻译
├── 📁 prisma/                        # 数据库相关
│   └── schema.prisma                 # 数据库Schema
├── 📁 public/                        # 静态资源
│   ├── manifest.json                 # PWA配置
│   └── 📁 images/                    # 图片资源
├── 📁 docs/                          # 项目文档
│   ├── DIRECTORY_STRUCTURE.md        # 目录结构说明
│   └── LAYOUT_OPTIMIZATION_SUMMARY.md # 布局优化总结
├── 📄 next.config.mjs                # Next.js配置
├── 📄 tailwind.config.ts             # Tailwind CSS配置
├── 📄 eslint.config.mjs              # ESLint配置
├── 📄 postcss.config.mjs             # PostCSS配置
├── 📄 next-intl.config.js            # 国际化配置
├── 📄 tsconfig.json                  # TypeScript配置
├── 📄 package.json                   # 项目依赖和脚本
└── 📄 README.md                      # 项目说明
```

## ✅ 优化完成的改进

### 🗑️ 已删除的冗余文件：
- ❌ `src/styles/globals.css` (与 `src/app/globals.css` 重复)
- ❌ `src/app/auth/` (空目录，已有国际化版本)

### 📦 已移动的文件：
- 📁 `src/tests/` → `src/__tests__/` (符合Jest标准)
- 📁 `src/locales/` → `messages/` (恢复到官方标准位置)

### 🔧 已更新的配置：
- ✅ `package.json` - 更新测试脚本路径
- ✅ `src/i18n/routing.ts` - 更新翻译文件路径

## 📋 目录结构规范说明

### 🎯 App Router结构 (`src/app/`)
- **根布局**: `layout.tsx` - 全局布局和providers
- **国际化路由**: `[locale]/` - 支持多语言的页面
- **API路由**: `api/` - 服务端API端点
- **样式文件**: `globals.css` - 全局样式和Tailwind

### 🧩 组件结构 (`src/components/`)
- **ui/**: 基础UI组件 (按钮、输入框等)
- **layout/**: 布局组件 (头部、侧边栏、底部)
- **sections/**: 页面区块 (英雄区、特性区等)
- **blocks/**: 可复用区块组件

### 🛠️ 工具和配置 (`src/lib/`, `src/hooks/`, etc.)
- **lib/**: 工具函数和第三方库配置
- **hooks/**: 自定义React Hooks
- **types/**: TypeScript类型定义
- **constants/**: 应用常量

### 🌐 国际化 (`src/i18n/`, `src/locales/`)
- **i18n/**: 国际化配置和路由
- **locales/**: 翻译文件 (JSON格式)

### 🧪 测试 (`src/__tests__/`)
- **__tests__/**: 所有测试文件
- **jest.config.js**: Jest测试配置

## 🎉 优化效果

### ✅ 符合Next.js 15最佳实践
### ✅ 清理了重复和冗余文件
### ✅ 标准化了目录命名
### ✅ 改进了项目可维护性
### ✅ 提升了开发体验

---

*目录结构优化完成时间: 2025-07-08*
*优化版本: v2.1*
