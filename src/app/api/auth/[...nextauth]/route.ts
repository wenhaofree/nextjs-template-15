import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

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
      if (profile) {
        user.name = profile.name || user.name;
        user.email = profile.email || user.email;
        user.image = profile.picture || profile.avatar_url || user.image;
      }
      return true;
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
