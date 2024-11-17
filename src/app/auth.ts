import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import { Agent } from "https";
import { HttpsProxyAgent } from "https-proxy-agent";

// Custom fetch with proxy support
const customFetch = async (url: string, options: any) => {
  const timeout = parseInt(process.env.NEXTAUTH_REQUEST_TIMEOUT || '30000');
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  
  const fetchOptions = {
    ...options,
    timeout,
    agent: proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined
  };

  try {
    const response = await fetch(url, fetchOptions);
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

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
          redirect_uri: "http://localhost:3000/api/auth/callback/google"
        }
      },
      token: {
        url: "https://oauth2.googleapis.com/token"
      },
      userinfo: {
        url: "https://www.googleapis.com/oauth2/v2/userinfo"
      },
      httpOptions: {
        timeout: parseInt(process.env.NEXTAUTH_REQUEST_TIMEOUT || '30000')
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
    async signIn({ user, account, profile }) {
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
  debug: process.env.NODE_ENV === 'development'
})
