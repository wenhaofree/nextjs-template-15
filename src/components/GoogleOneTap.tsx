"use client";

import { useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";

export default function GoogleOneTap() {
  const { data: session, status } = useSession();

  const handleCredentialResponse = useCallback(async (response: any) => {
    if (response.credential) {
      // 使用获取到的凭据调用NextAuth登录
      await signIn("google-one-tap", {
        credential: response.credential,
        redirect: false,
      });
    }
  }, []);

  useEffect(() => {
    // 仅在未登录状态且浏览器环境下初始化Google One Tap
    if (status === "unauthenticated" && typeof window !== "undefined") {
      // 确保googleOneTapPromptShown不存在或为false
      if (!localStorage.getItem("googleOneTapPromptShown")) {
        // 加载Google One Tap脚本
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
          if (window.google && process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID) {
            window.google.accounts.id.initialize({
              client_id: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID,
              callback: handleCredentialResponse,
              auto_select: true,
              cancel_on_tap_outside: true,
            });
            
            window.google.accounts.id.prompt((notification: any) => {
              if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                localStorage.setItem("googleOneTapPromptShown", "true");
              }
            });
          }
        };

        return () => {
          document.head.removeChild(script);
        };
      }
    }
  }, [status, handleCredentialResponse]);

  // 这是一个隐形组件，不需要渲染任何内容
  return null;
}
