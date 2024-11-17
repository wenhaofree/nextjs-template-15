import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string | null
    level: string
  }

  interface Session {
    user: User & {
      level: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    level: string
  }
} 