#!/usr/bin/env node

/**
 * 第三方登录功能验证脚本
 * 
 * 此脚本用于验证第三方登录功能是否正常工作，包括：
 * 1. 数据库连接测试
 * 2. 用户表结构验证
 * 3. OAuth登录流程模拟
 * 4. 数据存储验证
 */

const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

class OAuthLoginVerifier {
  constructor() {
    this.prisma = new PrismaClient();
    this.testResults = [];
  }

  async connect() {
    try {
      await this.prisma.$connect();
      this.log('✅ 数据库连接成功');
      return true;
    } catch (error) {
      this.log('❌ 数据库连接失败:', error.message);
      return false;
    }
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }

  log(message, ...args) {
    console.log(message, ...args);
    this.testResults.push({ message, args, timestamp: new Date() });
  }

  async verifyTableStructure() {
    this.log('\n🔍 验证数据库表结构...');
    
    try {
      // 检查User表是否存在必要字段
      const testUser = {
        uuid: `verify-${Date.now()}`,
        email: `verify-${Date.now()}@example.com`,
        nickname: '验证用户',
        signinProvider: 'test',
        signinType: 'oauth',
        signinIp: '127.0.0.1',
        signinOpenid: 'test_openid',
        avatarUrl: 'https://example.com/avatar.jpg',
      };

      const user = await this.prisma.user.create({
        data: testUser,
      });

      this.log('✅ User表结构验证通过');
      this.log(`   - 用户ID: ${user.id}`);
      this.log(`   - UUID: ${user.uuid}`);
      this.log(`   - 邮箱: ${user.email}`);
      this.log(`   - 登录提供商: ${user.signinProvider}`);
      this.log(`   - 创建时间: ${user.createdAt}`);

      // 清理测试数据
      await this.prisma.user.delete({ where: { id: user.id } });
      this.log('✅ 测试数据清理完成');

      return true;
    } catch (error) {
      this.log('❌ 表结构验证失败:', error.message);
      return false;
    }
  }

  async simulateGoogleLogin() {
    this.log('\n🔐 模拟Google OAuth登录...');
    
    try {
      const googleUserData = {
        uuid: uuidv4(),
        email: `google-test-${Date.now()}@gmail.com`,
        nickname: 'Google Test User',
        avatarUrl: 'https://lh3.googleusercontent.com/a/default-user',
        signinType: 'oauth',
        signinIp: '192.168.1.100',
        signinProvider: 'google',
        signinOpenid: `google_${Date.now()}`,
        createdAt: new Date(),
      };

      // 模拟首次登录 - 创建新用户
      const newUser = await this.prisma.user.create({
        data: googleUserData,
      });

      this.log('✅ Google用户创建成功');
      this.log(`   - 用户ID: ${newUser.id}`);
      this.log(`   - 邮箱: ${newUser.email}`);
      this.log(`   - OpenID: ${newUser.signinOpenid}`);

      // 模拟再次登录 - 查找现有用户
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: googleUserData.email,
          signinProvider: 'google',
        },
      });

      if (existingUser) {
        this.log('✅ 现有用户查找成功');
        
        // 模拟更新用户信息
        const updatedUser = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            nickname: 'Updated Google User',
            avatarUrl: 'https://lh3.googleusercontent.com/a/updated-avatar',
            signinIp: '192.168.1.101',
          },
        });

        this.log('✅ 用户信息更新成功');
        this.log(`   - 新昵称: ${updatedUser.nickname}`);
        this.log(`   - 新头像: ${updatedUser.avatarUrl}`);
        this.log(`   - 新IP: ${updatedUser.signinIp}`);
      }

      // 清理测试数据
      await this.prisma.user.delete({ where: { id: newUser.id } });
      this.log('✅ Google登录测试数据清理完成');

      return true;
    } catch (error) {
      this.log('❌ Google登录模拟失败:', error.message);
      return false;
    }
  }

  async simulateGitHubLogin() {
    this.log('\n🐙 模拟GitHub OAuth登录...');
    
    try {
      const githubUserData = {
        uuid: uuidv4(),
        email: `github-test-${Date.now()}@github.com`,
        nickname: 'GitHub Test User',
        avatarUrl: 'https://avatars.githubusercontent.com/u/123456',
        signinType: 'oauth',
        signinIp: '10.0.0.1',
        signinProvider: 'github',
        signinOpenid: `github_${Date.now()}`,
        createdAt: new Date(),
      };

      const user = await this.prisma.user.create({
        data: githubUserData,
      });

      this.log('✅ GitHub用户创建成功');
      this.log(`   - 用户ID: ${user.id}`);
      this.log(`   - 邮箱: ${user.email}`);
      this.log(`   - GitHub ID: ${user.signinOpenid}`);

      // 清理测试数据
      await this.prisma.user.delete({ where: { id: user.id } });
      this.log('✅ GitHub登录测试数据清理完成');

      return true;
    } catch (error) {
      this.log('❌ GitHub登录模拟失败:', error.message);
      return false;
    }
  }

  async simulateGoogleOneTapLogin() {
    this.log('\n⚡ 模拟Google One Tap登录...');
    
    try {
      const oneTapUserData = {
        uuid: `google_sub_${Date.now()}`,
        email: `onetap-test-${Date.now()}@gmail.com`,
        nickname: 'One Tap User',
        avatarUrl: 'https://lh3.googleusercontent.com/a/one-tap-avatar',
        signinType: 'oauth',
        signinIp: '172.16.0.1',
        signinProvider: 'google-one-tap',
        signinOpenid: `google_sub_${Date.now()}`,
        createdAt: new Date(),
      };

      const user = await this.prisma.user.create({
        data: oneTapUserData,
      });

      this.log('✅ Google One Tap用户创建成功');
      this.log(`   - 用户ID: ${user.id}`);
      this.log(`   - 邮箱: ${user.email}`);
      this.log(`   - Google Sub: ${user.uuid}`);

      // 清理测试数据
      await this.prisma.user.delete({ where: { id: user.id } });
      this.log('✅ Google One Tap测试数据清理完成');

      return true;
    } catch (error) {
      this.log('❌ Google One Tap登录模拟失败:', error.message);
      return false;
    }
  }

  async verifyUniqueConstraints() {
    this.log('\n🔒 验证唯一性约束...');
    
    try {
      const testEmail = `unique-test-${Date.now()}@example.com`;
      
      // 创建Google用户
      const googleUser = await this.prisma.user.create({
        data: {
          uuid: uuidv4(),
          email: testEmail,
          nickname: 'Google User',
          signinProvider: 'google',
          signinOpenid: 'google_unique_test',
        },
      });

      // 创建GitHub用户（相同邮箱，不同提供商）
      const githubUser = await this.prisma.user.create({
        data: {
          uuid: uuidv4(),
          email: testEmail,
          nickname: 'GitHub User',
          signinProvider: 'github',
          signinOpenid: 'github_unique_test',
        },
      });

      this.log('✅ 不同提供商相同邮箱创建成功');
      this.log(`   - Google用户ID: ${googleUser.id}`);
      this.log(`   - GitHub用户ID: ${githubUser.id}`);

      // 尝试创建重复的Google用户（应该失败）
      try {
        await this.prisma.user.create({
          data: {
            uuid: uuidv4(),
            email: testEmail,
            nickname: 'Duplicate Google User',
            signinProvider: 'google',
            signinOpenid: 'google_duplicate_test',
          },
        });
        this.log('❌ 唯一性约束验证失败：重复用户创建成功了');
      } catch (error) {
        this.log('✅ 唯一性约束验证通过：重复用户创建被阻止');
      }

      // 清理测试数据
      await this.prisma.user.delete({ where: { id: googleUser.id } });
      await this.prisma.user.delete({ where: { id: githubUser.id } });
      this.log('✅ 唯一性约束测试数据清理完成');

      return true;
    } catch (error) {
      this.log('❌ 唯一性约束验证失败:', error.message);
      return false;
    }
  }

  async checkExistingUsers() {
    this.log('\n📊 检查现有用户数据...');
    
    try {
      const totalUsers = await this.prisma.user.count();
      this.log(`📈 总用户数: ${totalUsers}`);

      const oauthUsers = await this.prisma.user.count({
        where: {
          signinType: 'oauth',
        },
      });
      this.log(`🔐 OAuth用户数: ${oauthUsers}`);

      const providerStats = await this.prisma.user.groupBy({
        by: ['signinProvider'],
        _count: {
          signinProvider: true,
        },
      });

      this.log('📋 按提供商分组统计:');
      providerStats.forEach(stat => {
        this.log(`   - ${stat.signinProvider}: ${stat._count.signinProvider} 用户`);
      });

      return true;
    } catch (error) {
      this.log('❌ 用户数据检查失败:', error.message);
      return false;
    }
  }

  async generateReport() {
    this.log('\n📋 生成验证报告...');
    
    const passedTests = this.testResults.filter(r => r.message.includes('✅')).length;
    const failedTests = this.testResults.filter(r => r.message.includes('❌')).length;
    
    this.log(`\n🎯 验证结果总结:`);
    this.log(`   ✅ 通过测试: ${passedTests}`);
    this.log(`   ❌ 失败测试: ${failedTests}`);
    this.log(`   📊 总测试数: ${passedTests + failedTests}`);
    
    if (failedTests === 0) {
      this.log('\n🎉 所有测试通过！第三方登录功能正常工作。');
    } else {
      this.log('\n⚠️ 存在失败的测试，请检查上述错误信息。');
    }
  }

  async run() {
    console.log('🚀 开始验证第三方登录功能...\n');
    
    const connected = await this.connect();
    if (!connected) {
      console.log('❌ 无法连接数据库，验证终止');
      return;
    }

    try {
      await this.verifyTableStructure();
      await this.simulateGoogleLogin();
      await this.simulateGitHubLogin();
      await this.simulateGoogleOneTapLogin();
      await this.verifyUniqueConstraints();
      await this.checkExistingUsers();
      await this.generateReport();
    } finally {
      await this.disconnect();
    }
  }
}

// 运行验证
if (require.main === module) {
  const verifier = new OAuthLoginVerifier();
  verifier.run().catch(console.error);
}

module.exports = OAuthLoginVerifier;
