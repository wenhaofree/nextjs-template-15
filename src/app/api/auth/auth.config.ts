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
    },
    async signIn({ user, account, profile }) {
      console.log('=== signIn callback started ===', {
        provider: account?.provider,
        userEmail: user.email,
        userName: user.name,
        timestamp: new Date().toISOString()
      })

      if (account?.provider !== 'google') return true
      
      const client = await pool.connect()
      
      try {
        await client.query('BEGIN')
        
        console.log('Checking if user exists...')
        const result = await client.query(
          'SELECT * FROM users WHERE email = $1',
          [user.email]
        )
        console.log('User query result:', {
          exists: result.rows.length > 0,
          timestamp: new Date().toISOString()
        })
        
        if (result.rows.length === 0) {
          console.log('Creating new user...')
          const insertResult = await client.query(
            'INSERT INTO users (email, name, level) VALUES ($1, $2, $3) RETURNING id',
            [user.email, user.name, 'free']
          )
          console.log('New user created:', {
            userId: insertResult.rows[0].id,
            timestamp: new Date().toISOString()
          })
        } else {
          console.log('Updating existing user...')
          const updateResult = await client.query(
            'UPDATE users SET name = $1 WHERE email = $2 RETURNING id',
            [user.name, user.email]
          )
          console.log('User updated:', {
            userId: updateResult.rows[0].id,
            timestamp: new Date().toISOString()
          })
        }
        
        await client.query('COMMIT')
        console.log('=== signIn callback completed successfully ===')
        return true
        
      } catch (error) {
        await client.query('ROLLBACK')
        console.error('Google login error:', {
          error: error instanceof Error ? error.message : error,
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString()
        })
        return false
      } finally {
        client.release()
      }
    }
  }
} 