# 价格页面月度/年度切换功能修复总结

## 🐛 问题描述

价格页面的月度和年度价格切换功能存在问题，点击切换按钮没有效果。

## 🔍 问题根源分析

1. **数据结构问题**：
   - 消息文件中的价格数据结构只有单一价格字段 `price`，没有区分月度和年度价格
   - 数据转换逻辑中，月度和年度价格被设置为相同值 `plan.price`

2. **Tab组件问题**：
   - Tab组件的 `setSelected` 函数接收文本值而非频率值
   - 点击Tab时传递的是显示文本而非实际频率值

3. **国际化支持问题**：
   - 频率标签没有国际化支持
   - 价格单位显示没有根据选择的频率动态变化

## 🛠️ 修复方案

### 1. 数据结构优化

#### 消息文件更新 (`messages/en.json` 和 `messages/zh.json`)
- 将单一 `price` 字段拆分为 `monthlyPrice` 和 `yearlyPrice`
- 添加频率标签的国际化支持
```json
"frequencies": {
  "monthly": "Monthly",
  "yearly": "Yearly"
}
```

#### 接口定义更新 (`src/components/sections/Pricing.tsx`)
```typescript
interface PricingProps {
  pricing: {
    title: string;
    subtitle: string;
    frequencies?: {
      monthly: string;
      yearly: string;
    };
    plans: Array<{
      name: string;
      monthlyPrice: number | string;
      yearlyPrice: number | string;
      description: string;
      features: string[];
    }>;
  };
}
```

### 2. 组件修复

#### PricingSection组件 (`src/components/blocks/pricing-section.tsx`)
- 添加 `frequencyLabels` 属性支持国际化标签
- 修改Tab组件调用方式，确保传递正确的频率值
```tsx
<Tab
  key={freq}
  text={frequencyLabels?.[freq] || freq}
  selected={selectedFrequency === freq}
  setSelected={() => setSelectedFrequency(freq)}
  discount={freq === "yearly"}
/>
```

#### Tab组件 (`src/components/ui/pricing-tab.tsx`)
- 修改接口定义，简化 `setSelected` 函数
```typescript
interface TabProps {
  text: string
  selected: boolean
  setSelected: () => void
  discount?: boolean
}
```
- 更新点击处理逻辑
```tsx
<button
  onClick={setSelected}
  className={cn(/*...*/)}
>
```

#### PricingCard组件 (`src/components/ui/pricing-card.tsx`)
- 根据选择的频率动态显示价格单位
```tsx
{paymentFrequency === "monthly" 
  ? (locale === "zh" ? "每月/用户" : "Per month/user")
  : (locale === "zh" ? "每年/用户" : "Per year/user")}
```

### 3. 数据转换逻辑更新

#### Pricing组件 (`src/components/sections/Pricing.tsx`)
- 更新数据转换逻辑，正确映射月度和年度价格
```typescript
const tiers = pricing.plans.map((plan, index) => ({
  // ...
  price: {
    monthly: plan.monthlyPrice,
    yearly: plan.yearlyPrice,
  },
  // ...
}));
```
- 添加频率标签国际化支持
```typescript
const frequencyLabels = {
  monthly: pricing.frequencies?.monthly || "Monthly",
  yearly: pricing.frequencies?.yearly || "Yearly"
};
```

## ✅ 修复效果

1. **功能恢复**：
   - 月度/年度价格切换功能正常工作
   - 点击切换按钮可以正确切换价格显示

2. **用户体验提升**：
   - 年度价格提供20%折扣，显示"Save 20%"标签
   - 价格单位根据选择的频率动态变化
   - 支持中英文界面的频率标签显示

3. **代码质量改进**：
   - 更清晰的数据结构
   - 更好的类型安全
   - 更完善的国际化支持

## 🧪 测试验证

- ✅ 构建成功，无编译错误
- ✅ 月度/年度切换功能正常工作
- ✅ 价格和单位正确显示
- ✅ 国际化支持正常工作

## 📝 后续建议

1. **价格计算优化**：
   - 考虑添加自动计算年度价格的逻辑，基于月度价格和折扣率
   - 例如：`yearlyPrice = monthlyPrice * 12 * (1 - discountRate)`

2. **UI增强**：
   - 考虑添加价格切换动画效果
   - 可以显示年度方案相比月度方案的节省金额

3. **支付流程优化**：
   - 确保支付API处理逻辑支持不同的付款周期
   - 在订单确认页面清晰显示付款周期