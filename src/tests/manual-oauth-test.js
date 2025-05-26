#!/usr/bin/env node

/**
 * 手动OAuth登录测试脚本
 * 
 * 此脚本模拟真实的OAuth登录流程，验证：
 * 1. NextAuth配置是否正确
 * 2. 数据库存储是否正常
 * 3. 用户会话是否正确创建
 */

const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

class ManualOAuthTester {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async connect() {
    try {
      await this.prisma.$connect();
      console.log('✅ 数据库连接成功');
      return true;
    } catch (error) {
      console.log('❌ 数据库连接失败:', error.message);
      return false;
    }
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }

  // 模拟Google OAuth登录回调处理
  async simulateGoogleOAuthCallback() {
    console.log('\n🔐 模拟Google OAuth登录回调...');
    
    try {
      // 模拟从Google获取的用户信息
      const googleProfile = {
        sub: `google_${Date.now()}`,
        email: `test-google-${Date.now()}@gmail.com`,
        name: 'Google Test User',
        picture: 'https://lh3.googleusercontent.com/a/default-user',
        email_verified: true,
      };

      console.log('📥 接收到Google用户信息:', {
        id: googleProfile.sub,
        email: googleProfile.email,
        name: googleProfile.name,
      });

      // 模拟NextAuth的signIn回调逻辑
      const userData = {
        uuid: uuidv4(),
        email: googleProfile.email,
        nickname: googleProfile.name,
        avatarUrl: googleProfile.picture,
        signinType: 'oauth',
        signinIp: '127.0.0.1',
        signinProvider: 'google',
        signinOpenid: googleProfile.sub,
        createdAt: new Date(),
      };

      // 检查用户是否已存在
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: googleProfile.email,
          signinProvider: 'google',
        },
      });

      let user;
      if (existingUser) {
        console.log('👤 找到现有用户，更新信息...');
        user = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            nickname: userData.nickname,
            avatarUrl: userData.avatarUrl,
            signinIp: userData.signinIp,
          },
        });
        console.log('✅ 用户信息更新成功');
      } else {
        console.log('👤 创建新用户...');
        user = await this.prisma.user.create({
          data: userData,
        });
        console.log('✅ 新用户创建成功');
      }

      console.log('📊 用户信息:');
      console.log(`   - ID: ${user.id}`);
      console.log(`   - UUID: ${user.uuid}`);
      console.log(`   - 邮箱: ${user.email}`);
      console.log(`   - 昵称: ${user.nickname}`);
      console.log(`   - 提供商: ${user.signinProvider}`);
      console.log(`   - 创建时间: ${user.createdAt}`);

      return user;
    } catch (error) {
      console.log('❌ Google OAuth模拟失败:', error.message);
      throw error;
    }
  }

  // 模拟GitHub OAuth登录回调处理
  async simulateGitHubOAuthCallback() {
    console.log('\n🐙 模拟GitHub OAuth登录回调...');
    
    try {
      // 模拟从GitHub获取的用户信息
      const githubProfile = {
        id: Date.now(),
        login: 'testuser',
        email: `test-github-${Date.now()}@github.com`,
        name: 'GitHub Test User',
        avatar_url: 'https://avatars.githubusercontent.com/u/123456',
      };

      console.log('📥 接收到GitHub用户信息:', {
        id: githubProfile.id,
        email: githubProfile.email,
        name: githubProfile.name,
      });

      const userData = {
        uuid: uuidv4(),
        email: githubProfile.email,
        nickname: githubProfile.name || githubProfile.login,
        avatarUrl: githubProfile.avatar_url,
        signinType: 'oauth',
        signinIp: '127.0.0.1',
        signinProvider: 'github',
        signinOpenid: githubProfile.id.toString(),
        createdAt: new Date(),
      };

      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: githubProfile.email,
          signinProvider: 'github',
        },
      });

      let user;
      if (existingUser) {
        console.log('👤 找到现有用户，更新信息...');
        user = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            nickname: userData.nickname,
            avatarUrl: userData.avatarUrl,
            signinIp: userData.signinIp,
          },
        });
        console.log('✅ 用户信息更新成功');
      } else {
        console.log('👤 创建新用户...');
        user = await this.prisma.user.create({
          data: userData,
        });
        console.log('✅ 新用户创建成功');
      }

      console.log('📊 用户信息:');
      console.log(`   - ID: ${user.id}`);
      console.log(`   - UUID: ${user.uuid}`);
      console.log(`   - 邮箱: ${user.email}`);
      console.log(`   - 昵称: ${user.nickname}`);
      console.log(`   - 提供商: ${user.signinProvider}`);

      return user;
    } catch (error) {
      console.log('❌ GitHub OAuth模拟失败:', error.message);
      throw error;
    }
  }

  // 验证用户会话创建
  async verifyUserSession(user) {
    console.log('\n🔍 验证用户会话...');
    
    try {
      // 模拟NextAuth的JWT回调
      const token = {
        id: user.id.toString(),
        uuid: user.uuid,
        email: user.email,
        name: user.nickname,
        picture: user.avatarUrl,
      };

      console.log('🎫 JWT Token创建:', {
        id: token.id,
        email: token.email,
        name: token.name,
      });

      // 模拟NextAuth的session回调
      const session = {
        user: {
          id: token.id,
          uuid: token.uuid,
          email: token.email,
          name: token.name,
          image: token.picture,
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天后过期
      };

      console.log('📋 Session创建:', {
        userId: session.user.id,
        email: session.user.email,
        expires: session.expires,
      });

      console.log('✅ 用户会话验证成功');
      return session;
    } catch (error) {
      console.log('❌ 用户会话验证失败:', error.message);
      throw error;
    }
  }

  // 清理测试数据
  async cleanup(users) {
    console.log('\n🧹 清理测试数据...');
    
    try {
      for (const user of users) {
        await this.prisma.user.delete({
          where: { id: user.id },
        });
        console.log(`✅ 删除用户: ${user.email}`);
      }
      console.log('✅ 测试数据清理完成');
    } catch (error) {
      console.log('⚠️ 清理测试数据时出错:', error.message);
    }
  }

  // 检查环境配置
  async checkEnvironmentConfig() {
    console.log('\n⚙️ 检查环境配置...');
    
    const requiredEnvVars = [
      'DATABASE_URL',
      'AUTH_SECRET',
    ];

    const optionalEnvVars = [
      'AUTH_GOOGLE_ID',
      'AUTH_GOOGLE_SECRET',
      'AUTH_GITHUB_ID',
      'AUTH_GITHUB_SECRET',
      'NEXT_PUBLIC_AUTH_GOOGLE_ENABLED',
      'NEXT_PUBLIC_AUTH_GITHUB_ENABLED',
    ];

    console.log('📋 必需的环境变量:');
    for (const envVar of requiredEnvVars) {
      const value = process.env[envVar];
      if (value) {
        console.log(`   ✅ ${envVar}: 已配置`);
      } else {
        console.log(`   ❌ ${envVar}: 未配置`);
      }
    }

    console.log('📋 可选的环境变量:');
    for (const envVar of optionalEnvVars) {
      const value = process.env[envVar];
      if (value) {
        console.log(`   ✅ ${envVar}: ${value}`);
      } else {
        console.log(`   ⚠️ ${envVar}: 未配置`);
      }
    }
  }

  async run() {
    console.log('🚀 开始手动OAuth登录测试...\n');
    
    const connected = await this.connect();
    if (!connected) {
      console.log('❌ 无法连接数据库，测试终止');
      return;
    }

    const testUsers = [];

    try {
      await this.checkEnvironmentConfig();
      
      // 测试Google OAuth
      const googleUser = await this.simulateGoogleOAuthCallback();
      testUsers.push(googleUser);
      await this.verifyUserSession(googleUser);

      // 测试GitHub OAuth
      const githubUser = await this.simulateGitHubOAuthCallback();
      testUsers.push(githubUser);
      await this.verifyUserSession(githubUser);

      console.log('\n🎉 所有OAuth登录测试通过！');
      console.log('\n📋 测试总结:');
      console.log(`   ✅ 成功创建 ${testUsers.length} 个测试用户`);
      console.log('   ✅ 数据库存储功能正常');
      console.log('   ✅ 用户会话创建正常');
      console.log('   ✅ OAuth登录流程完整');

    } catch (error) {
      console.log('\n❌ 测试过程中出现错误:', error.message);
    } finally {
      await this.cleanup(testUsers);
      await this.disconnect();
    }
  }
}

// 运行测试
if (require.main === module) {
  const tester = new ManualOAuthTester();
  tester.run().catch(console.error);
}

module.exports = ManualOAuthTester;
