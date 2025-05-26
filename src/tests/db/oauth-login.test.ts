import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

describe('第三方登录功能测试', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // 清理测试数据的辅助函数
  const cleanupTestUser = async (email: string, provider: string) => {
    try {
      await prisma.user.deleteMany({
        where: {
          email,
          signinProvider: provider,
        },
      });
    } catch (error) {
      console.log('清理测试数据时出错:', error);
    }
  };

  describe('Google OAuth 登录', () => {
    const testEmail = `google-test-${Date.now()}@example.com`;
    const testProvider = 'google';

    afterEach(async () => {
      await cleanupTestUser(testEmail, testProvider);
    });

    test('应该能够创建新的Google用户', async () => {
      const userData = {
        uuid: uuidv4(),
        email: testEmail,
        nickname: 'Google Test User',
        avatarUrl: 'https://example.com/avatar.jpg',
        signinType: 'oauth',
        signinIp: '127.0.0.1',
        signinProvider: testProvider,
        signinOpenid: 'google_123456',
        createdAt: new Date(),
      };

      const user = await prisma.user.create({
        data: userData,
      });

      // 验证用户创建成功
      expect(user).toBeDefined();
      expect(user.email).toBe(testEmail);
      expect(user.signinProvider).toBe(testProvider);
      expect(user.signinType).toBe('oauth');
      expect(user.signinOpenid).toBe('google_123456');
      expect(user.nickname).toBe('Google Test User');
      expect(user.avatarUrl).toBe('https://example.com/avatar.jpg');
      expect(user.isDeleted).toBe(false);
    });

    test('应该能够更新现有Google用户信息', async () => {
      // 首先创建用户
      const initialData = {
        uuid: uuidv4(),
        email: testEmail,
        nickname: 'Initial Name',
        avatarUrl: 'https://example.com/old-avatar.jpg',
        signinProvider: testProvider,
        signinOpenid: 'google_123456789',
      };

      const user = await prisma.user.create({
        data: initialData,
      });

      // 模拟用户信息更新
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          nickname: 'Updated Name',
          avatarUrl: 'https://example.com/new-avatar.jpg',
          signinIp: '192.168.1.1',
        },
      });

      expect(updatedUser.nickname).toBe('Updated Name');
      expect(updatedUser.avatarUrl).toBe('https://example.com/new-avatar.jpg');
      expect(updatedUser.signinIp).toBe('192.168.1.1');
    });

    test('应该能够通过email和provider查找用户', async () => {
      // 创建测试用户
      const userData = {
        uuid: uuidv4(),
        email: testEmail,
        nickname: 'Findable User',
        signinProvider: testProvider,
        signinOpenid: 'google_findable',
      };

      await prisma.user.create({
        data: userData,
      });

      // 查找用户
      const foundUser = await prisma.user.findFirst({
        where: {
          email: testEmail,
          signinProvider: testProvider,
        },
      });

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe(testEmail);
      expect(foundUser?.signinProvider).toBe(testProvider);
      expect(foundUser?.nickname).toBe('Findable User');
    });
  });

  describe('GitHub OAuth 登录', () => {
    const testEmail = `github-test-${Date.now()}@example.com`;
    const testProvider = 'github';

    afterEach(async () => {
      await cleanupTestUser(testEmail, testProvider);
    });

    test('应该能够创建新的GitHub用户', async () => {
      const userData = {
        uuid: uuidv4(),
        email: testEmail,
        nickname: 'GitHub Test User',
        avatarUrl: 'https://github.com/avatar.jpg',
        signinType: 'oauth',
        signinIp: '127.0.0.1',
        signinProvider: testProvider,
        signinOpenid: 'github_987654321',
        createdAt: new Date(),
      };

      const user = await prisma.user.create({
        data: userData,
      });

      expect(user).toBeDefined();
      expect(user.email).toBe(testEmail);
      expect(user.signinProvider).toBe(testProvider);
      expect(user.signinOpenid).toBe('github_987654321');
      expect(user.nickname).toBe('GitHub Test User');
    });
  });

  describe('Google One Tap 登录', () => {
    const testEmail = `google-one-tap-test-${Date.now()}@example.com`;
    const testProvider = 'google-one-tap';

    afterEach(async () => {
      await cleanupTestUser(testEmail, testProvider);
    });

    test('应该能够创建新的Google One Tap用户', async () => {
      const userData = {
        uuid: 'google_sub_123456',
        email: testEmail,
        nickname: 'One Tap User',
        avatarUrl: 'https://lh3.googleusercontent.com/avatar.jpg',
        signinType: 'oauth',
        signinIp: '127.0.0.1',
        signinProvider: testProvider,
        signinOpenid: 'google_sub_123456',
        createdAt: new Date(),
      };

      const user = await prisma.user.create({
        data: userData,
      });

      expect(user).toBeDefined();
      expect(user.email).toBe(testEmail);
      expect(user.signinProvider).toBe(testProvider);
      expect(user.uuid).toBe('google_sub_123456');
    });
  });

  describe('用户唯一性约束测试', () => {
    const testEmail = `unique-test-${Date.now()}@example.com`;

    afterEach(async () => {
      await cleanupTestUser(testEmail, 'google');
      await cleanupTestUser(testEmail, 'github');
    });

    test('同一邮箱可以有不同的登录提供商', async () => {
      // 创建Google用户
      const googleUser = await prisma.user.create({
        data: {
          uuid: uuidv4(),
          email: testEmail,
          nickname: 'Google User',
          signinProvider: 'google',
          signinOpenid: 'google_123',
        },
      });

      // 创建GitHub用户（相同邮箱，不同提供商）
      const githubUser = await prisma.user.create({
        data: {
          uuid: uuidv4(),
          email: testEmail,
          nickname: 'GitHub User',
          signinProvider: 'github',
          signinOpenid: 'github_123',
        },
      });

      expect(googleUser.email).toBe(githubUser.email);
      expect(googleUser.signinProvider).toBe('google');
      expect(githubUser.signinProvider).toBe('github');
      expect(googleUser.id).not.toBe(githubUser.id);
    });

    test('相同邮箱和提供商应该违反唯一约束', async () => {
      // 创建第一个用户
      await prisma.user.create({
        data: {
          uuid: uuidv4(),
          email: testEmail,
          nickname: 'First User',
          signinProvider: 'google',
          signinOpenid: 'google_first',
        },
      });

      // 尝试创建相同邮箱和提供商的用户，应该失败
      await expect(
        prisma.user.create({
          data: {
            uuid: uuidv4(),
            email: testEmail,
            nickname: 'Second User',
            signinProvider: 'google',
            signinOpenid: 'google_second',
          },
        })
      ).rejects.toThrow();
    });
  });

  describe('数据完整性测试', () => {
    test('必填字段验证', async () => {
      // 测试缺少必填字段的情况
      await expect(
        prisma.user.create({
          data: {
            // 缺少 uuid
            email: `missing-uuid-${Date.now()}@example.com`,
            signinProvider: 'test',
          } as any,
        })
      ).rejects.toThrow();

      await expect(
        prisma.user.create({
          data: {
            uuid: uuidv4(),
            // 缺少 email
            signinProvider: 'test',
          } as any,
        })
      ).rejects.toThrow();
    });

    test('字段长度限制', async () => {
      const longString = 'a'.repeat(300); // 超过255字符限制

      await expect(
        prisma.user.create({
          data: {
            uuid: uuidv4(),
            email: `test-${Date.now()}@example.com`,
            nickname: longString, // 应该失败，超过255字符
            signinProvider: 'test',
          },
        })
      ).rejects.toThrow();
    });
  });
});
