/**
 * Button Component / 按钮组件
 *
 * @description A flexible and customizable button component with multiple variants, sizes, and states.
 * Supports all standard HTML button attributes and custom styling through Tailwind CSS.
 * @description 具有多种变体、尺寸和状态的灵活可自定义按钮组件。
 * 支持所有标准 HTML 按钮属性和通过 Tailwind CSS 的自定义样式。
 *
 * @features
 * - Multiple variants (default, destructive, outline, secondary, ghost, link)
 * - Different sizes (default, sm, lg, icon)
 * - Loading and disabled states
 * - Full accessibility support
 * - Polymorphic component support with asChild prop
 *
 * @特性
 * - 多种变体（默认、破坏性、轮廓、次要、幽灵、链接）
 * - 不同尺寸（默认、小、大、图标）
 * - 加载和禁用状态
 * - 完整的无障碍支持
 * - 通过 asChild 属性支持多态组件
 *
 * @author ShipSaaS.CO
 * @version 1.0.0
 * @since 2024-01-01
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button variant styles using class-variance-authority
 * 使用 class-variance-authority 的按钮变体样式
 *
 * @description Defines the visual styles for different button variants and sizes
 * @description 定义不同按钮变体和尺寸的视觉样式
 */
const buttonVariants = cva(
  // Base styles applied to all button variants / 应用于所有按钮变体的基础样式
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /** Primary button style / 主要按钮样式 */
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        /** Destructive action button (delete, remove, etc.) / 破坏性操作按钮（删除、移除等） */
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        /** Outlined button with border / 带边框的轮廓按钮 */
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        /** Secondary button style / 次要按钮样式 */
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        /** Ghost button with no background / 无背景的幽灵按钮 */
        ghost: "hover:bg-accent hover:text-accent-foreground",
        /** Link-style button / 链接样式按钮 */
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        /** Default button size / 默认按钮尺寸 */
        default: "h-10 px-4 py-2",
        /** Small button size / 小按钮尺寸 */
        sm: "h-9 rounded-md px-3",
        /** Large button size / 大按钮尺寸 */
        lg: "h-11 rounded-md px-8",
        /** Icon-only button size / 仅图标按钮尺寸 */
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

/**
 * Button component props interface
 * 按钮组件属性接口
 *
 * @description Extends standard HTML button attributes with custom variant and size options
 * @description 扩展标准 HTML 按钮属性，添加自定义变体和尺寸选项
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, the button will render as a child component (polymorphic)
   * 当为 true 时，按钮将渲染为子组件（多态）
   *
   * @description Allows the button to be rendered as any other component
   * while maintaining button styling and behavior
   * @description 允许按钮渲染为任何其他组件，同时保持按钮样式和行为
   *
   * @default false
   * @example
   * ```tsx
   * <Button asChild>
   *   <Link href="/dashboard">Go to Dashboard</Link>
   * </Button>
   * ```
   */
  asChild?: boolean
}

/**
 * Button - A flexible and accessible button component
 * Button - 灵活且无障碍的按钮组件
 *
 * @description The main button component that supports multiple variants, sizes, and states.
 * Built with accessibility in mind and supports polymorphic rendering through the asChild prop.
 * @description 支持多种变体、尺寸和状态的主要按钮组件。
 * 考虑到无障碍性而构建，通过 asChild 属性支持多态渲染。
 *
 * @param props - Button component props / 按钮组件属性
 * @param ref - Forwarded ref to the button element / 转发到按钮元素的引用
 * @returns JSX.Element
 *
 * @example Basic usage / 基本用法
 * ```tsx
 * <Button variant="default" size="lg">
 *   Click me
 * </Button>
 * ```
 *
 * @example With loading state / 加载状态
 * ```tsx
 * <Button disabled={isLoading}>
 *   {isLoading ? 'Loading...' : 'Submit'}
 * </Button>
 * ```
 *
 * @example As a link / 作为链接
 * ```tsx
 * <Button asChild>
 *   <Link href="/dashboard">Dashboard</Link>
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
 *
 * @accessibility
 * - Supports keyboard navigation (Enter and Space keys)
 * - Proper focus management with visible focus indicators
 * - Screen reader compatible with proper ARIA attributes
 * - Disabled state properly communicated to assistive technologies
 *
 * @无障碍性
 * - 支持键盘导航（Enter 和 Space 键）
 * - 具有可见焦点指示器的适当焦点管理
 * - 与屏幕阅读器兼容，具有适当的 ARIA 属性
 * - 禁用状态正确传达给辅助技术
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Use Slot for polymorphic rendering when asChild is true
    // 当 asChild 为 true 时使用 Slot 进行多态渲染
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
