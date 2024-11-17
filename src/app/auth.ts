import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google";

// Custom fetch with proxy support

// Get the NEXTAUTH_URL from environment variables
const nextAuthUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth",
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
          redirect_uri: `${nextAuthUrl}/api/auth/callback/google`
        }
      },
      token: {
        url: "https://oauth2.googleapis.com/token"
      },
      userinfo: {
        url: "https://www.googleapis.com/oauth2/v2/userinfo"
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { 
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 hours
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development',
  trustHost: true
})
