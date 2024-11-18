import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { Pool } from 'pg'

// Reuse DB pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('请输入邮箱和密码')
        }

        const client = await pool.connect()
        
        try {
          console.log('Attempting database connection...')
          
          const result = await client.query(
            'SELECT * FROM users WHERE email = $1',
            [credentials.email]
          )

          console.log('Query result:', result.rows.length > 0)
          
          const user = result.rows[0]

          if (!user) {
            throw new Error('邮箱或密码错误')
          }

          // Compare passwords
          const passwordMatch = await compare(credentials.password, user.password_hash)

          if (!passwordMatch) {
            throw new Error('邮箱或密码错误') 
          }

          // Return user object without password
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            level: user.level
          }

        } catch (error) {
          console.error('详细错误信息:', error)
          throw error
        } finally {
          client.release()
        }
      }
    })
  ],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.level = user.level
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.level = token.level
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }

export const authOptions = {
  // Your NextAuth.js configuration options
  providers: [
    // Your providers...
  ],
  // Other options...
} 