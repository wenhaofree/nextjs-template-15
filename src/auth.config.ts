import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { headers } from 'next/headers';

export const config: AuthOptions = {
  providers: [
    ...(process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true" && process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
    ...(process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED === "true" && process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
      ? [
          GithubProvider({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
          }),
        ]
      : []),
  ],
  debug: true,
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
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
  },
}; 