// app/api/products/route.js
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'; // 默认行为为 auto


export async function GET(request: NextRequest) {
    // 处理 GET 请求
    return new Response('Hello, Products!', { status: 200 });
}

export async function POST(request: NextRequest) {
    // 处理 POST 请求
    const data = await request.json();
    // 处理数据逻辑
    return new Response('Product created!', { status: 201 });
}