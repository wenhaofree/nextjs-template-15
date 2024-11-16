// app/page.js
/**
 * 
 * @returns Next.js 15 支持并行和顺序的数据获取方式，以优化加载性能。
并行数据获取
默认情况下，多个请求会并行启动，这样可以减少加载时间。例如，在布局组件中，可以同时请求多个数据源。
顺序数据获取
如果某个请求依赖于另一个请求的结果，则可以按顺序进行。例如，先获取用户信息，再根据用户 ID 获取相关的帖子
 */
export default async function Page() {
    const userRes = await fetch('https://api.example.com/user');
    const user = await userRes.json();

    const postsRes = await fetch(`https://api.example.com/posts?userId=${user.id}`);
    const posts = await postsRes.json();

    return (
        <div>
            <h1>{user.name}'s Posts</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    );
}