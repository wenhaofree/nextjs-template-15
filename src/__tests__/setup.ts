import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

// 创建全局的PrismaClient实例
const prisma = new PrismaClient();

async function setup() {
  try {
    console.log('🚀 测试环境设置开始...');
    
    // 执行迁移确保数据库结构最新
    console.log('📦 推送Schema到测试数据库...');
    execSync('npx dotenv-cli -e .env.test -- npx prisma db push --accept-data-loss', { 
      stdio: 'inherit'
    });
    
    // 测试数据库连接
    console.log('🔌 测试数据库连接...');
    await prisma.$connect();
    console.log('✅ 数据库连接成功');
    
    // 检查数据库中是否有表
    const tableCount = await prisma.$queryRaw`
      SELECT count(*) FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📊 数据库表数量:', tableCount);
    
    // 添加测试数据（可选）
    console.log('🧪 设置测试数据...');
    
    // 创建一个测试用户
    try {
      await prisma.user.create({
        data: {
          uuid: `test-${Date.now()}`,
          email: `test-${Date.now()}@example.com`,
          nickname: '测试用户',
          signinProvider: 'test'
        },
      });
      console.log('✅ 测试用户创建成功');
    } catch (error) {
      console.log('⚠️ 测试用户创建失败，可能已存在:', error);
    }
    
    console.log('✅ 测试环境设置完成');
    return prisma;
  } catch (error) {
    console.error('❌ 测试环境设置失败:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

export default setup; 