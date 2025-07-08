import { PrismaClient } from '@prisma/client';

describe('数据库连接测试', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('应该能够连接到数据库', async () => {
    // 简单查询来验证连接
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    expect(result).toBeTruthy();
  });

  test('Prisma客户端应该可用', () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma.user.findMany).toBe('function');
    expect(typeof prisma.order.findMany).toBe('function');
  });
}); 