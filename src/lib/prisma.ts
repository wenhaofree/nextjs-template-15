import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// 扩展类型，处理password字段问题
export type UserWithPassword = {
  password?: string;
} & Awaited<ReturnType<typeof prisma.user.findFirst>>;

/**
 * 扩展的findUser方法，支持使用password字段查询和返回
 */
export async function findUserWithPassword(email: string, provider: string) {
  // 这里使用any绕过TypeScript类型检查
  const user = await prisma.user.findFirst({
    where: {
      email,
      signinProvider: provider,
      isDeleted: false,
    } as any,
  }) as UserWithPassword;
  
  return user;
}

/**
 * 创建用户，支持password字段
 */
export async function createUserWithPassword(userData: { 
  uuid: string;
  email: string;
  password: string;
  signinProvider: string;
  nickname?: string;
}) {
  // 使用any绕过类型检查
  const user = await prisma.user.create({
    data: {
      uuid: userData.uuid,
      email: userData.email,
      password: userData.password,
      signinProvider: userData.signinProvider,
      nickname: userData.nickname,
      isDeleted: false,
    } as any,
  });
  
  return user;
}
