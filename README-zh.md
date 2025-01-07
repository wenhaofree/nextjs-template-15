# 分支介绍：顺序创建
- main：同步最新的稳定版本
- base: 原始基础功能；
- Internet：国际化
- LandingPage：落地页分支
- Next-auth：集成Next-auth；
- db： neno数据库


# Next.js15 新特性
## 路由：
1. 基本路由：app/路径文件夹/page.tsx
2. 模板：app/路径文件夹/template.tsx+page.tsx
3. 动态路由：app/路径文件夹/[id]/page.tsx
4. 动态 API 路由：app/api/路径文件夹/[id]/route.ts
5. Cors跨越：app/api/route.ts