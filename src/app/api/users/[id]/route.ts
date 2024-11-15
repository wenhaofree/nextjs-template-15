// app/api/users/[id]/route.js
import { NextRequest } from "next/server";
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params; // 获取动态参数 id
    // 假设我们有一个函数 getUserById 来获取用户信息
    // const user = await getUserById(id); 
    const user = id; 
    return new Response(JSON.stringify(user), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}