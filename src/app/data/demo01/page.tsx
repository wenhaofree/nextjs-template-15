// app/page.js
// 去除缓存机制
export default async function Page() {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        next: { revalidate: 60 }, // 每60秒重新验证一次
    });
    const data = await res.json();
    
    return (
        <ul>
            {data.map((item) => (
                <li key={item.id}>{item.title}</li>
            ))}
        </ul>
    );
}