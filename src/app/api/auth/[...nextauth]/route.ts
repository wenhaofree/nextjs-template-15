import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export const authOptions = {
  providers: [
    ...(process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true"
      ? [
          GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
          }),
        ]
      : []),
    ...(process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED === "true"
      ? [
          GithubProvider({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
            httpOptions: {
              timeout: 40000,
            },
          }),
        ]
      : []),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "development" ? "next-auth.session-token" : "__Secure-next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.signinProvider = account?.provider;
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
      if (!user.email) {
        return false;
      }

      try {
        const existingUser = await prisma.user.findFirst({
          where: {
            email: user.email,
          },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              uuid: uuidv4(),
              email: user.email,
              nickname: user.name || user.email?.split("@")[0],
              avatarUrl: user.image,
              signinProvider: account?.provider,
            },
          });
        } else {
          await prisma.user.update({
            where: {
              email_signinProvider: {
                email: user.email,
                signinProvider: account?.provider || existingUser.signinProvider
              }
            },
            data: {
              nickname: user.name || existingUser.nickname,
              avatarUrl: user.image || existingUser.avatarUrl,
              signinProvider: account?.provider || existingUser.signinProvider,
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
