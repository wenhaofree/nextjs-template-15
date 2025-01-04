# 引用依赖：
- 引用shadcnUI: 
    - 用于UI组件的快速开发
    - https://ui.shadcn.com/docs/installation/next
    - npm install shadcn-ui
    - npx shadcn@latest init -d

- 引用Clerk：
    - 用于用户登录注册-暂时不用！
    - 参见官网： https://dashboard.clerk.com/
    - 本期内容废弃-采用谷歌登录方式

- next-intl:
    - 用于国际化
    - 参见： https://next-intl-docs.vercel.app/docs/getting-started/app-router/with-i18n-routing

- next-auth:
    - 用于验证; 谷歌验证+自定义邮箱登录验证
    - 参见： https://next-auth.js.org/getting-started/example
    - 谷歌登录本地测试必须要纯净IP才能登录,否则超时问题.
    
- Sonner:
    - 用于弹窗;
    - 参见: https://sonner.emilkowal.ski/


# 本地运行：
```
$ pnpm run db:setup
$ pnpm run db:seed

自动创建表结构和测试数据：

admin@example.com (管理员用户)
test@example.com (免费用户)
premium@example.com (高级用户)

Admin用户: Admin123!@#
Test用户: Test123!@#
Premium用户: Premium123!@#

```



# 开发流程:
## 开发注意:
1. 不要轻易修改package.json的版本依赖. 应用了最新Next.js15版本

## 页面:
1. V0网站; 根据图片附近和AI描述生成React的代码
2. 复制到tsx中,直接Cursor对话完善

## 逻辑:
1. 提交:标题和URL
2. 存储: 人工校验: 图片,修改有效状态;
3. 列表排序

### 支付逻辑:
1. 用户先支付页面,后提交
    - 支付成功: 修改用户level和session
    - 提交成功: 
        - 更新用户level
        - 新增数据,状态pedding
        - 发送提醒邮件
        - 更新站点的md文件和json文件

2. 用户提交页面.
    - 支付成功: 直接记录
    - 

## 部署问题:
1. 配置的服务器的域名: 要和对应上
2. 注意Stripe的配置:webhook


## MVP-TODO:
1. 登录注册✅
2. 支付✅
3. 工具数据填充✅
4. 国际化处理✅
4. SEO内容✅
5. 部署测试
6. 最后统一调整样式

7. Logo
8. 搜索✅
9. 内容生成✅
10. 优先英文上线, 只有一种语言✅
11. 联系方式的邮箱;
12. 明日上线.

## 上线部署dev.aistak.com
1. 修改配置文件



## TODO:
1. 提交AI页面✅
    - 提交数据如何存储? Neon-谷歌账号✅
    - 数据分类:
        - 固定分类, 然后llm解析网址,添加分类标签
        - 分类和工具的多对多表关联;
        - 分类数据来源处理;
    - 数据缓存
        - 定时更新缓存数据

2. 价格页面-验证支付
    - stripe配置测试环境✅
    - 测试支付成功✅
    - 成功后修改账号级别✅
    - 保存数据✅
3. logo
4. 广告置顶-付费
5. 博客功能-付费增加博客推荐
6. 底部页面
    - 增加推荐内容展示
    - 多语言切换✅
7. 国际化语言功能
    - 所有页面的国际化✅
    - 主流语言的国际化✅
    - 工具详情页面国际化
    - Card列表国际化
    
8. 法律条款和隐私政策
9. 社交账号关联
10. Card详情页面✅
11. 详情的社交媒体分享功能
12. 404页面,500页面✅

