import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'
import { getOptimalImageQuality, browserCapabilities } from '@/lib/modern-polyfills'

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string
  alt: string
  className?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  responsive?: boolean
  quality?: number
}

/**
 * 优化的图片组件
 * 自动应用最佳实践的图片优化设置
 */
export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  loading = 'lazy',
  responsive = true,
  quality,
  ...props
}: OptimizedImageProps) {
  // 根据网络条件动态调整质量
  const optimalQuality = quality || getOptimalImageQuality()

  // 生成响应式尺寸
  const sizes = responsive
    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    : props.sizes

  return (
    <Image
      src={src}
      alt={alt}
      className={cn('transition-opacity duration-300', className)}
      priority={priority}
      loading={loading}
      quality={optimalQuality}
      sizes={sizes}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      {...props}
    />
  )
}

/**
 * 英雄区域图片组件
 * 针对首屏图片优化
 */
export function HeroImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      priority={true} // 首屏图片优先加载
      loading="eager"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}

/**
 * 头像图片组件
 * 针对小尺寸头像优化
 */
export function AvatarImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      sizes="(max-width: 768px) 40px, 48px"
      className={cn('rounded-full', props.className)}
    />
  )
}

/**
 * 产品图片组件
 * 针对产品展示图片优化
 */
export function ProductImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      quality={90} // 产品图片需要更高质量
    />
  )
}
