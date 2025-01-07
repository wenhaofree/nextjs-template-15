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
              timeout: 10000,
            },
          }),
        ]
      : []),
  ],
  debug: true,
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.provider = account?.provider;
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
            signinProvider: account?.provider,
          },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              uuid: uuidv4(),
              email: user.email,
              nickname: user.name,
              avatarUrl: user.image,
              signinProvider: account?.provider,
              signinType: "oauth",
              createdAt: new Date(),
            },
          });
        } else {
          await prisma.user.update({
            where: {
              id: existingUser.id,
            },
            data: {
              nickname: user.name || existingUser.nickname,
              avatarUrl: user.image || existingUser.avatarUrl,
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error saving user to database:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
