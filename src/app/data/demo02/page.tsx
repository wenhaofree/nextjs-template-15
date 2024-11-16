import { getData } from "@/app/actions/getData";
// Server Actions 是 Next.js 15 中的新特性，它允许您在组件内直接调用服务器端函数，而不需要手动创建 API 路由。这使得数据获取更加简洁和高效。
export default async function Page() {
    const data = await getData();
    
    return (
        <ul>
            {data.map((item) => (
                <li key={item.id}>{item.title}</li>
            ))}
        </ul>
    );
}