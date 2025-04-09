import type { Session, User } from "next-auth";
import type { AuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { prisma, findUserWithPassword } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { headers } from 'next/headers';
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { compare } from 'bcryptjs';
import { getServerSession } from 'next-auth/next';

// 添加Google One Tap凭据提供者
const googleOneTapProvider = CredentialsProvider({
  id: "google-one-tap",
  name: "Google One Tap",
  credentials: {
    credential: { type: "text" }
  },
  async authorize(credentials) {
    try {
      if (!credentials?.credential) return null;
      
      // 解码Google提供的JWT令牌
      const decoded: any = jwtDecode(credentials.credential);
      
      // 处理用户信息
      const userData = {
        uuid: decoded.sub,
        email: decoded.email,
        nickname: decoded.name,
        avatarUrl: decoded.picture,
        signinType: 'oauth',
        signinIp: '127.0.0.1', // 可以使用相同的IP获取逻辑
        signinProvider: 'google-one-tap',
        signinOpenid: decoded.sub,
        createdAt: new Date(),
      };

      // 查找或创建用户
      const existingUser = await prisma.user.findFirst({
        where: {
          email: decoded.email,
          signinProvider: 'google-one-tap',
        },
      });

      if (existingUser) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            nickname: userData.nickname,
            avatarUrl: userData.avatarUrl,
          },
        });
      } else {
        await prisma.user.create({ data: userData });
      }

      // 返回符合User接口的对象
      return {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        image: decoded.picture,
        uuid: decoded.sub // 添加uuid字段以符合User接口要求
      };
    } catch (error) {
      console.error("Google One Tap验证错误:", error);
      return null;
    }
  }
});

// 添加邮箱密码登录提供者
const credentialsProvider = CredentialsProvider({
  name: 'Credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      return null;
    }

    // 使用辅助函数查找用户，包含password字段
    const user = await findUserWithPassword(credentials.email, 'credentials');

    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await compare(
      credentials.password,
      user.password
    );

    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user.id.toString(),
      email: user.email,
      name: user.nickname || '',
      image: user.avatarUrl || '',
      uuid: user.uuid,
    };
  },
});

export const config: AuthOptions = {
  providers: [
    // 配置GitHub登录
    ...(process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED === "true" && process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
      ? [
          GithubProvider({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
          }),
        ]
      : []),
    // 配置Google登录
    ...(process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true" && process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
    // 配置Google One Tap登录
    ...(process.env.NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED === "true"
      ? [googleOneTapProvider]
      : []),
    // 添加邮箱密码登录
    credentialsProvider,
  ],
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.AUTH_SECRET,
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 900
      }
    },
    state: {
      name: 'next-auth.state',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 900
      }
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        // 如果有uuid, 添加到token
        if ('uuid' in user) {
          token.uuid = user.uuid;
        }
      }
      
      // 如果是OAuth登录，处理用户信息
      if (user && account && account.provider !== 'credentials') {
        try {
          // 查找或创建用户
          let dbUser = await prisma.user.findFirst({
            where: {
              email: user.email || '',
              signinProvider: account.provider,
            },
          });
          
          if (!dbUser) {
            // 如果用户不存在，创建新用户
            dbUser = await prisma.user.create({
              data: {
                uuid: uuidv4(),
                email: user.email || '',
                nickname: user.name || '',
                avatarUrl: user.image || '',
                signinProvider: account.provider,
                signinOpenid: account.providerAccountId,
              },
            });
          }
          
          // 更新token
          token.id = dbUser.id.toString();
          token.uuid = dbUser.uuid;
        } catch (error) {
          console.error('Error in JWT callback:', error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.uuid = token.uuid as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) {
          console.error('No email provided by OAuth provider');
          return false;
        }

        // Get IP address from headers with await
        let ip = '127.0.0.1';
        try {
          const headersList = await headers();
          const forwardedFor = headersList.get('x-forwarded-for');
          ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';
        } catch (error) {
          console.error('Error getting IP address:', error);
          // Continue with default IP if headers() fails
        }

        // Prepare user data
        const userData = {
          uuid: uuidv4(),
          email: user.email,
          nickname: profile?.name || user.name,
          avatarUrl: profile?.picture || profile?.avatar_url || user.image,
          // locale: profile?.locale || 'en',
          signinType: 'oauth',
          signinIp: ip,
          signinProvider: account?.provider,
          signinOpenid: account?.providerAccountId,
          createdAt: new Date(),
        };

        console.log('Attempting to save user data:', userData);

        // Try to find existing user
        const existingUser = await prisma.user.findFirst({
          where: {
            email: user.email,
            signinProvider: account?.provider,
          },
        });

        if (existingUser) {
          console.log('Updating existing user:', existingUser.id);
          // Update existing user
          await prisma.user.update({
            where: {
              id: existingUser.id,
            },
            data: {
              nickname: userData.nickname,
              avatarUrl: userData.avatarUrl,
              signinIp: ip,
              // locale: userData.locale,
            },
          });
        } else {
          console.log('Creating new user');
          // Create new user
          await prisma.user.create({
            data: userData,
          });
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        // Log detailed error information
        if (error instanceof Error) {
          console.error('Error name:', error.name);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
        // Still return true to allow sign in even if DB save fails
        return true;
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
};

export async function getSession() {
  return getServerSession(config);
} 