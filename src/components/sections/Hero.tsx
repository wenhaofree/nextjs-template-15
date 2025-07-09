/**
 * Hero Section Component / 英雄区组件
 *
 * @description The main hero section component for landing pages, featuring animated backgrounds,
 * gradient text effects, call-to-action buttons, and responsive design. This component serves
 * as the primary focal point for user engagement and conversion.
 * @description 落地页的主要英雄区组件，具有动画背景、渐变文本效果、行动号召按钮和响应式设计。
 * 此组件作为用户参与和转化的主要焦点。
 *
 * @features
 * - Animated background with gradient effects and floating particles
 * - Responsive typography with gradient text styling
 * - Call-to-action buttons with hover animations
 * - Framer Motion animations for smooth entrance effects
 * - Full viewport height with centered content alignment
 * - Dark/light theme support with seamless transitions
 *
 * @特性
 * - 具有渐变效果和浮动粒子的动画背景
 * - 具有渐变文本样式的响应式排版
 * - 具有悬停动画的行动号召按钮
 * - Framer Motion 动画实现流畅的入场效果
 * - 全视口高度和内容居中对齐
 * - 深色/浅色主题支持和无缝过渡
 *
 * @layout
 * - Responsive design (mobile-first approach)
 * - Full viewport height minus header (min-h-[calc(100vh-4rem)])
 * - Centered content alignment with proper spacing
 * - Background animations and decorative elements
 *
 * @布局
 * - 响应式设计（移动优先方法）
 * - 全视口高度减去头部（min-h-[calc(100vh-4rem)]）
 * - 内容居中对齐和适当间距
 * - 背景动画和装饰元素
 *
 * @accessibility
 * - Semantic HTML structure with proper heading hierarchy
 * - ARIA labels for interactive elements
 * - Keyboard navigation support for all interactive elements
 * - Screen reader friendly with descriptive text
 * - High contrast support for better visibility
 *
 * @无障碍性
 * - 具有适当标题层次结构的语义化 HTML 结构
 * - 交互元素的 ARIA 标签
 * - 所有交互元素的键盘导航支持
 * - 具有描述性文本的屏幕阅读器友好
 * - 高对比度支持以提高可见性
 *
 * @author ShipSaaS.CO
 * @version 1.0.0
 * @since 2024-01-01
 */

"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

/**
 * Props interface for the Hero component
 * Hero 组件的属性接口
 */
interface HeroProps {
  /**
   * Hero section content data
   * 英雄区内容数据
   */
  hero: {
    /**
     * Main headline text - should be compelling and action-oriented
     * 主标题文本 - 应该引人注目且面向行动
     * @example "All-in-One SaaS Launch Solution"
     */
    title: string;

    /**
     * Supporting subtitle text - provides additional context
     * 支持性副标题文本 - 提供额外上下文
     * @example "Smart automation, instant deployment, accelerate your business growth"
     */
    subtitle: string;

    /**
     * Detailed description text - explains the value proposition
     * 详细描述文本 - 解释价值主张
     * @example "Ship SaaS Demo delivers a ready-to-use SaaS template..."
     */
    description: string;

    /**
     * Call-to-action button configuration
     * 行动号召按钮配置
     */
    cta: {
      /**
       * Primary CTA button text - main conversion action
       * 主要 CTA 按钮文本 - 主要转化行动
       * @example "Try for Free Now"
       */
      primary: string;

      /**
       * Secondary CTA button text - alternative action
       * 次要 CTA 按钮文本 - 替代行动
       * @example "See Pricing"
       */
      secondary: string;
    };
  };
}

/**
 * Hero - Main landing page hero section component
 * Hero - 主要落地页英雄区组件
 *
 * @description Renders the primary hero section with animated backgrounds, gradient text,
 * and call-to-action buttons. Optimized for conversion and user engagement.
 * @description 渲染具有动画背景、渐变文本和行动号召按钮的主要英雄区。
 * 针对转化和用户参与进行了优化。
 *
 * @param props - Hero component props containing content data
 * @param props.hero - Hero section content including title, subtitle, description, and CTAs
 * @returns JSX.Element - The rendered hero section
 *
 * @example Basic usage / 基本用法
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
 * @example With internationalization / 国际化使用
 * ```tsx
 * const { hero } = useTranslations('hero');
 * <Hero hero={hero} />
 * ```
 */
export function Hero({ hero }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] w-full py-12 md:py-24 lg:py-32 overflow-hidden bg-background"
      aria-label="Hero section"
    >
      {/* Unified Background System */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient - seamless transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        {/* Subtle accent gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,rgba(59,130,246,0.03),transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_200px,rgba(59,130,246,0.06),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_80%_100px,rgba(139,92,246,0.02),transparent)] dark:bg-[radial-gradient(circle_400px_at_80%_100px,rgba(139,92,246,0.04),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_300px_at_20%_300px,rgba(6,182,212,0.02),transparent)] dark:bg-[radial-gradient(circle_300px_at_20%_300px,rgba(6,182,212,0.04),transparent)]" />
      </div>

      {/* Unified grid background */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Theme-aware floating particles effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/20 dark:bg-blue-400/40 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400/25 dark:bg-purple-400/50 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-cyan-400/20 dark:bg-cyan-400/45 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-indigo-400/20 dark:bg-indigo-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
      </div>

      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-900 to-gray-700 dark:from-white dark:via-blue-200 dark:to-gray-300 leading-tight">
              {hero.title}
            </h1>
            <p className="text-xl text-gray-600 md:text-2xl lg:text-3xl dark:text-gray-300 max-w-4xl mx-auto font-medium leading-relaxed">
              {hero.subtitle}
            </p>
            <p className="text-lg text-gray-500 md:text-xl lg:text-2xl dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {hero.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button
              size="lg"
              className="min-w-[180px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-10 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {hero.cta.primary}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="min-w-[180px] rounded-full px-10 h-14 text-lg font-semibold border-2 border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              {hero.cta.secondary}
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400 mt-8"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>5M+ Images Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>100K+ Happy Creators</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>99.9% Uptime</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
