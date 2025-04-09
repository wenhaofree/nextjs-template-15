"use client";

import dynamic from "next/dynamic";

// 动态导入GoogleOneTap组件，避免服务器渲染
const GoogleOneTap = dynamic(() => import("./GoogleOneTap"), {
  ssr: false,
});

export default function GoogleOneTapWrapper() {
  // 仅在NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED为true时渲染
  if (process.env.NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED !== "true") {
    return null;
  }
  
  return <GoogleOneTap />;
}
