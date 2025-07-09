import { HeaderSkeleton, HeroSkeleton } from "@/components/ui/loading-skeleton"

/**
 * 全局加载页面
 * 在页面切换时显示，提供更好的用户体验
 */
export default function Loading() {
  return (
    <div className="min-h-screen">
      <HeaderSkeleton />
      <HeroSkeleton />
    </div>
  )
}
