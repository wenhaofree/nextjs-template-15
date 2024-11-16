// app/api/route.js
// Cors
import { NextRequest } from "next/server";
export const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // 允许所有源访问
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // 允许的 HTTP 方法
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // 允许的请求头
};

export async function GET(request: NextRequest) {
    return new Response('Hello, Next.js!', {
        status: 200,
        headers: corsHeaders,
    });
}

export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: corsHeaders,
    });
}