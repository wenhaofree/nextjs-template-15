# Component Documentation Standards / 组件文档标准

## Overview / 概述

This document establishes comprehensive documentation standards for React components in the ShipSaaS project, supporting both English and Chinese languages.

本文档为 ShipSaaS 项目中的 React 组件建立了全面的文档标准，支持英文和中文两种语言。

## Documentation Structure / 文档结构

### 1. File Header Documentation / 文件头部文档

Every component file should start with a comprehensive header comment:

每个组件文件都应该以全面的头部注释开始：

```typescript
/**
 * Component Name / 组件名称
 * 
 * @description Brief description of the component's purpose and functionality
 * @description 组件用途和功能的简要描述
 * 
 * @author ShipSaaS.CO
 * @version 1.0.0
 * @since 2024-01-01
 * 
 * @example
 * ```tsx
 * <ComponentName prop1="value" prop2={true} />
 * ```
 */
```

### 2. Interface Documentation / 接口文档

All TypeScript interfaces should be thoroughly documented:

所有 TypeScript 接口都应该被彻底记录：

```typescript
/**
 * Props interface for ComponentName
 * ComponentName 组件的属性接口
 */
interface ComponentNameProps {
  /**
   * The title text to display
   * 要显示的标题文本
   */
  title: string;
  
  /**
   * Optional subtitle text
   * 可选的副标题文本
   * @default undefined
   */
  subtitle?: string;
  
  /**
   * Whether the component is disabled
   * 组件是否被禁用
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Callback function triggered on click
   * 点击时触发的回调函数
   * @param event - The click event / 点击事件
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

### 3. Component Documentation / 组件文档

Main component function should include comprehensive JSDoc:

主组件函数应该包含全面的 JSDoc：

```typescript
/**
 * ComponentName - A reusable UI component for [purpose]
 * ComponentName - 用于[用途]的可重用 UI 组件
 * 
 * @description Detailed description of what the component does, its behavior,
 * and any important implementation details.
 * @description 组件功能、行为和重要实现细节的详细描述。
 * 
 * @param props - The component props / 组件属性
 * @returns JSX.Element
 * 
 * @example
 * ```tsx
 * // Basic usage / 基本用法
 * <ComponentName title="Hello World" />
 * 
 * // With all props / 使用所有属性
 * <ComponentName 
 *   title="Hello World"
 *   subtitle="Welcome to ShipSaaS"
 *   disabled={false}
 *   onClick={(e) => console.log('Clicked!')}
 * />
 * ```
 * 
 * @see {@link RelatedComponent} for similar functionality
 * @see {@link RelatedComponent} 查看类似功能
 */
export function ComponentName({ title, subtitle, disabled = false, onClick }: ComponentNameProps) {
  // Component implementation
}
```

## Documentation Categories / 文档分类

### 1. UI Components / UI 组件

For basic UI components (buttons, inputs, cards):

对于基础 UI 组件（按钮、输入框、卡片）：

```typescript
/**
 * Button - A customizable button component
 * Button - 可自定义的按钮组件
 * 
 * @description A flexible button component with multiple variants, sizes, and states.
 * Supports all standard HTML button attributes and custom styling.
 * @description 具有多种变体、尺寸和状态的灵活按钮组件。
 * 支持所有标准 HTML 按钮属性和自定义样式。
 * 
 * @features
 * - Multiple variants (default, destructive, outline, secondary, ghost, link)
 * - Different sizes (default, sm, lg, icon)
 * - Loading and disabled states
 * - Full accessibility support
 * 
 * @特性
 * - 多种变体（默认、破坏性、轮廓、次要、幽灵、链接）
 * - 不同尺寸（默认、小、大、图标）
 * - 加载和禁用状态
 * - 完整的无障碍支持
 */
```

### 2. Section Components / 区块组件

For page section components (Hero, Features, Pricing):

对于页面区块组件（英雄区、功能区、定价区）：

```typescript
/**
 * Hero - Landing page hero section component
 * Hero - 落地页英雄区组件
 * 
 * @description The main hero section component for landing pages, featuring
 * animated backgrounds, gradient text, and call-to-action buttons.
 * @description 落地页的主要英雄区组件，具有动画背景、渐变文本和行动号召按钮。
 * 
 * @layout
 * - Responsive design (mobile-first)
 * - Full viewport height
 * - Centered content alignment
 * - Background animations and effects
 * 
 * @布局
 * - 响应式设计（移动优先）
 * - 全视口高度
 * - 内容居中对齐
 * - 背景动画和效果
 * 
 * @accessibility
 * - Semantic HTML structure
 * - ARIA labels for interactive elements
 * - Keyboard navigation support
 * - Screen reader friendly
 * 
 * @无障碍性
 * - 语义化 HTML 结构
 * - 交互元素的 ARIA 标签
 * - 键盘导航支持
 * - 屏幕阅读器友好
 */
```

### 3. Layout Components / 布局组件

For layout components (Header, Footer, Navigation):

对于布局组件（头部、底部、导航）：

```typescript
/**
 * Header - Main navigation header component
 * Header - 主导航头部组件
 * 
 * @description The main header component containing navigation, user menu,
 * theme toggle, and language switcher.
 * @description 包含导航、用户菜单、主题切换和语言切换器的主头部组件。
 * 
 * @navigation
 * - Logo and brand name
 * - Main navigation links
 * - User authentication menu
 * - Theme toggle button
 * - Language switcher
 * 
 * @导航
 * - Logo 和品牌名称
 * - 主导航链接
 * - 用户认证菜单
 * - 主题切换按钮
 * - 语言切换器
 * 
 * @responsive
 * - Desktop: Full horizontal navigation
 * - Mobile: Hamburger menu with slide-out drawer
 * - Tablet: Adaptive layout based on screen size
 * 
 * @响应式
 * - 桌面端：完整的水平导航
 * - 移动端：汉堡菜单和滑出抽屉
 * - 平板端：基于屏幕尺寸的自适应布局
 */
```

## Code Comments Standards / 代码注释标准

### 1. Inline Comments / 行内注释

Use bilingual inline comments for complex logic:

对复杂逻辑使用双语行内注释：

```typescript
// Prevent hydration mismatch by only rendering theme-dependent content after mount
// 通过仅在挂载后渲染主题相关内容来防止水合不匹配
useEffect(() => {
  setMounted(true);
}, []);

// Calculate responsive grid columns based on screen size
// 根据屏幕尺寸计算响应式网格列数
const gridColumns = useMemo(() => {
  if (screenSize === 'mobile') return 1;
  if (screenSize === 'tablet') return 2;
  return 3;
}, [screenSize]);
```

### 2. Function Comments / 函数注释

Document utility functions and hooks:

记录工具函数和钩子：

```typescript
/**
 * Custom hook for managing theme state with hydration safety
 * 用于管理主题状态并确保水合安全的自定义钩子
 * 
 * @returns Object containing theme state and setter function
 * @returns 包含主题状态和设置函数的对象
 */
export function useThemeSafe() {
  // Implementation
}

/**
 * Utility function to format currency values
 * 格式化货币值的工具函数
 * 
 * @param amount - The amount to format / 要格式化的金额
 * @param currency - The currency code (default: 'USD') / 货币代码（默认：'USD'）
 * @returns Formatted currency string / 格式化的货币字符串
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  // Implementation
}
```

## Usage Examples / 使用示例

### 1. Basic Component Example / 基础组件示例

```typescript
/**
 * @example Basic usage / 基本用法
 * ```tsx
 * <Button variant="default" size="lg">
 *   Click me
 * </Button>
 * ```
 * 
 * @example With loading state / 加载状态
 * ```tsx
 * <Button variant="default" disabled={isLoading}>
 *   {isLoading ? 'Loading...' : 'Submit'}
 * </Button>
 * ```
 * 
 * @example Custom styling / 自定义样式
 * ```tsx
 * <Button 
 *   variant="outline" 
 *   className="bg-gradient-to-r from-blue-500 to-purple-600"
 * >
 *   Gradient Button
 * </Button>
 * ```
 */
```

### 2. Complex Component Example / 复杂组件示例

```typescript
/**
 * @example Complete hero section / 完整英雄区
 * ```tsx
 * <Hero 
 *   hero={{
 *     title: "Welcome to ShipSaaS",
 *     subtitle: "Build and launch your SaaS faster",
 *     description: "Complete SaaS template with authentication, payments, and more",
 *     cta: {
 *       primary: "Get Started",
 *       secondary: "Learn More"
 *     }
 *   }}
 * />
 * ```
 * 
 * @example With custom animations / 自定义动画
 * ```tsx
 * <Hero 
 *   hero={heroData}
 *   animationDelay={0.5}
 *   enableParticles={true}
 * />
 * ```
 */
```

## Best Practices / 最佳实践

### 1. Documentation Guidelines / 文档指南

- Always provide both English and Chinese descriptions
- Include practical usage examples
- Document all props with types and default values
- Explain complex logic with inline comments
- Use consistent terminology across all documentation

- 始终提供英文和中文描述
- 包含实际使用示例
- 记录所有属性及其类型和默认值
- 用行内注释解释复杂逻辑
- 在所有文档中使用一致的术语

### 2. Code Organization / 代码组织

- Group related interfaces and types together
- Place component documentation before implementation
- Use consistent naming conventions
- Organize imports logically
- Separate concerns clearly

- 将相关接口和类型组合在一起
- 将组件文档放在实现之前
- 使用一致的命名约定
- 逻辑性地组织导入
- 清晰地分离关注点

### 3. Maintenance / 维护

- Update documentation when changing component behavior
- Keep examples current and working
- Review documentation during code reviews
- Ensure bilingual consistency
- Test all documented examples

- 更改组件行为时更新文档
- 保持示例的时效性和可用性
- 在代码审查期间审查文档
- 确保双语一致性
- 测试所有记录的示例
