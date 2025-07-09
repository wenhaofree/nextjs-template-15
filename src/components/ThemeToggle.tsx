/**
 * ThemeToggle Component / 主题切换组件
 *
 * @description A theme toggle button component that allows users to switch between light and dark themes.
 * Implements hydration-safe rendering to prevent mismatches between server and client rendering.
 * @description 允许用户在浅色和深色主题之间切换的主题切换按钮组件。
 * 实现水合安全渲染以防止服务器和客户端渲染之间的不匹配。
 *
 * @features
 * - Smooth theme transitions with animated icons
 * - Hydration-safe rendering to prevent SSR/client mismatches
 * - Accessible button with proper ARIA labels
 * - Visual feedback with icon rotation animations
 * - Integration with next-themes for global theme management
 *
 * @特性
 * - 具有动画图标的流畅主题过渡
 * - 水合安全渲染以防止 SSR/客户端不匹配
 * - 具有适当 ARIA 标签的无障碍按钮
 * - 具有图标旋转动画的视觉反馈
 * - 与 next-themes 集成进行全局主题管理
 *
 * @accessibility
 * - Screen reader support with descriptive labels
 * - Keyboard navigation (Enter and Space keys)
 * - High contrast icon visibility in both themes
 * - Proper focus management and visual indicators
 *
 * @无障碍性
 * - 具有描述性标签的屏幕阅读器支持
 * - 键盘导航（Enter 和 Space 键）
 * - 两种主题下的高对比度图标可见性
 * - 适当的焦点管理和视觉指示器
 *
 * @author ShipSaaS.CO
 * @version 1.0.0
 * @since 2024-01-01
 */

"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * ThemeToggle - A button component for switching between light and dark themes
 * ThemeToggle - 用于在浅色和深色主题之间切换的按钮组件
 *
 * @description Renders a theme toggle button with animated icons that switches between
 * light and dark themes. Implements hydration-safe rendering to prevent SSR mismatches.
 * @description 渲染具有动画图标的主题切换按钮，在浅色和深色主题之间切换。
 * 实现水合安全渲染以防止 SSR 不匹配。
 *
 * @returns JSX.Element - The theme toggle button component
 *
 * @example Basic usage / 基本用法
 * ```tsx
 * <ThemeToggle />
 * ```
 *
 * @example In a navigation bar / 在导航栏中
 * ```tsx
 * <nav className="flex items-center gap-4">
 *   <Logo />
 *   <NavigationMenu />
 *   <ThemeToggle />
 * </nav>
 * ```
 *
 * @hydration
 * This component uses a mounted state to prevent hydration mismatches.
 * During SSR, it renders a disabled button with the Sun icon.
 * After hydration, it shows the appropriate icon based on the current theme.
 *
 * @水合
 * 此组件使用挂载状态来防止水合不匹配。
 * 在 SSR 期间，它渲染一个带有太阳图标的禁用按钮。
 * 水合后，它根据当前主题显示适当的图标。
 */
export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  // 通过仅在挂载后渲染主题相关内容来防止水合不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  // 在挂载之前不渲染任何内容以防止水合不匹配
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 relative"
        disabled
        aria-label="Loading theme toggle"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">切换主题</span>
      </Button>
    );
  }

  // Render the interactive theme toggle button after hydration
  // 水合后渲染交互式主题切换按钮
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 relative"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {/* Sun icon - visible in light mode, hidden in dark mode */}
      {/* 太阳图标 - 在浅色模式下可见，在深色模式下隐藏 */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

      {/* Moon icon - hidden in light mode, visible in dark mode */}
      {/* 月亮图标 - 在浅色模式下隐藏，在深色模式下可见 */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

      {/* Screen reader text for accessibility */}
      {/* 用于无障碍的屏幕阅读器文本 */}
      <span className="sr-only">切换主题</span>
    </Button>
  );
}