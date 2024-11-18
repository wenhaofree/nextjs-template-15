import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { Pool } from 'pg'
import { AuthOptions, User as AuthUser } from "next-auth"
import { JWT } from "next-auth/jwt"

// 扩展 NextAuth 的 User 类型
interface UserExtended extends AuthUser {
  level: string;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

export const authOptions: AuthOptions = {
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

          const passwordMatch = await compare(credentials.password, user.password_hash)

          if (!passwordMatch) {
            throw new Error('邮箱或密码错误') 
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || '',  // 确保 name 不为 null
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
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.level = (user as UserExtended).level
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as UserExtended).level = token.level as string
      }
      return session
    }
  }
} 