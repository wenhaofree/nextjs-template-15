// import type { InferGetStaticPropsType, GetStaticProps } from 'next'
 
// type Repo = {
//   name: string
//   stargazers_count: number
// }
// export const getStaticProps = (async () => {
//   console.log('getStaticProps is running at:', new Date().toISOString())
//   const res = await fetch('https://api.github.com/repos/vercel/next.js')
//   const repo = await res.json()
//   return { 
//     props: { repo },
//     // 每10秒重新生成页面
//     revalidate: 10
//   }
// }) satisfies GetStaticProps<{
//   repo: Repo
// }>


async function getData() {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}
 
export default async function Page() {
  const data = await getData()
 
  return <div>
    <h1>Next.js GitHub Stars: {data.stargazers_count}</h1>
  </div>
}
