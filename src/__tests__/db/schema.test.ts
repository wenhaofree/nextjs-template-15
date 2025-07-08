import { PrismaClient } from '@prisma/client';

describe('数据库表结构测试', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('User表结构应该正确', async () => {
    // 创建测试用户
    const user = await prisma.user.create({
      data: {
        uuid: `test-${Date.now()}`,
        email: `test-${Date.now()}@example.com`,
        nickname: '测试用户',
        signinProvider: 'test'
      },
    });

    // 验证所有字段都存在且类型正确
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('uuid');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
    expect(user).toHaveProperty('isDeleted', false);
    expect(user.deletedAt).toBeNull();

    // 清理测试数据
    await prisma.user.delete({ where: { id: user.id } });
  });

  test('Order表结构应该正确', async () => {
    // 首先创建一个用户
    const user = await prisma.user.create({
      data: {
        uuid: `test-order-${Date.now()}`,
        email: `test-order-${Date.now()}@example.com`,
        signinProvider: 'test'
      },
    });

    // 创建测试订单
    const order = await prisma.order.create({
      data: {
        orderNo: `TEST-${Date.now()}`,
        userUuid: user.uuid,
        userEmail: user.email,
        amount: 100,
        status: 'pending',
        credits: 10
      },
    });

    // 验证所有字段都存在且类型正确
    expect(order).toHaveProperty('id');
    expect(order).toHaveProperty('orderNo');
    expect(order).toHaveProperty('createdAt');
    expect(order).toHaveProperty('updatedAt');
    expect(order).toHaveProperty('userUuid');
    expect(order).toHaveProperty('userEmail');
    expect(order).toHaveProperty('amount');
    expect(order).toHaveProperty('status');
    expect(order).toHaveProperty('credits');
    expect(order).toHaveProperty('isDeleted', false);
    expect(order.deletedAt).toBeNull();

    // 测试关联关系
    const orderWithUser = await prisma.order.findUnique({
      where: { id: order.id },
      include: { user: true }
    });

    expect(orderWithUser?.user).toBeDefined();
    expect(orderWithUser?.user.uuid).toBe(user.uuid);

    // 清理测试数据
    await prisma.order.delete({ where: { id: order.id } });
    await prisma.user.delete({ where: { id: user.id } });
  });

  // 测试软删除功能
  test('软删除功能应该正常工作', async () => {
    // 创建测试用户
    const user = await prisma.user.create({
      data: {
        uuid: `test-delete-${Date.now()}`,
        email: `test-delete-${Date.now()}@example.com`,
        signinProvider: 'test'
      },
    });

    // 模拟软删除
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        isDeleted: true,
        deletedAt: new Date()
      }
    });

    // 验证软删除标记
    const deletedUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    expect(deletedUser?.isDeleted).toBe(true);
    expect(deletedUser?.deletedAt).not.toBeNull();

    // 物理删除测试数据
    await prisma.user.delete({ where: { id: user.id } });
  });
}); 