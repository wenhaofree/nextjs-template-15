import NextAuth from "next-auth";
import { DefaultSession } from 'next-auth';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      uuid: string;
    } & DefaultSession['user'];
  }
  
  interface Profile {
    id?: string;
    name?: string;
    email?: string;
    avatar_url?: string;
    picture?: string;
  }

  /**
   * 扩展默认用户类型
   */
  interface User {
    id: string;
    uuid: string;
  }
}

declare module 'next-auth/jwt' {
  /** 扩展JWT类型 */
  interface JWT {
    id: string;
    uuid: string;
  }
}
