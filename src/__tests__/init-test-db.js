/**
 * 测试数据库初始化脚本
 * 用于在测试前准备好数据库环境
 */

const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// 确保.env.test使用不带TLS的连接字符串
function ensureNoTlsConnection() {
  const envTestPath = path.join(process.cwd(), '.env.test');
  
  if (fs.existsSync(envTestPath)) {
    let envContent = fs.readFileSync(envTestPath, 'utf8');
    
    // 检查是否包含DATABASE_URL
    if (envContent.includes('DATABASE_URL')) {
      // 替换为不带TLS的连接
      const newContent = envContent.replace(
        /DATABASE_URL=(['"])(postgresql:\/\/[^?]*)(\?[^'"]*)?(['"])/,
        'DATABASE_URL=$1$2?sslmode=disable$4'
      );
      
      // 如果内容有变化，写回文件
      if (newContent !== envContent) {
        fs.writeFileSync(envTestPath, newContent, 'utf8');
        console.log('✅ 已更新.env.test移除TLS要求');
      }
    }
  }
}

async function main() {
  console.log('🔄 开始初始化测试数据库环境...');
  
  try {
    // 确保连接不使用TLS
    ensureNoTlsConnection();
    
    // 1. 推送Schema到测试数据库
    console.log('\n📦 步骤1: 推送Schema到测试数据库...');
    
    // 使用临时环境变量确保不使用TLS
    const env = { ...process.env };
    
    try {
      // 尝试用--schema-only方式推送，避免TLS问题
      execSync('npx dotenv-cli -e .env.test -- npx prisma db push --accept-data-loss --skip-generate', { 
        stdio: 'inherit',
        env: {
          ...env,
          DATABASE_URL: 'postgresql://root:fuwenhao@192.168.1.11:5432/wenhao?sslmode=disable'
        } 
      });
      console.log('✅ Schema推送成功');
    } catch (error) {
      console.error('❌ Schema推送失败:', error.message);
      console.log('\n🔄 尝试不同的连接方式...');
      
      // 使用psql直接连接可能更可靠
      try {
        execSync('psql -h 192.168.1.11 -U root -d wenhao -c "SELECT 1"', { 
          stdio: 'inherit' 
        });
        console.log('✅ PostgreSQL直接连接测试成功');
      } catch (error) {
        console.error('❌ PostgreSQL直接连接测试失败:', error.message);
        throw new Error('数据库连接问题，请检查凭据和网络设置');
      }
    }
    
    // 2. 生成Prisma客户端
    console.log('\n🛠️ 步骤2: 生成Prisma客户端...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma客户端生成成功');
    
    // 3. 测试数据库连接并添加测试数据
    console.log('\n🔌 步骤3: 测试数据库连接...');
    
    // 创建带有明确禁用SSL的Prisma客户端
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: 'postgresql://root:fuwenhao@192.168.1.11:5432/wenhao?sslmode=disable'
        }
      }
    });
    
    await prisma.$connect();
    console.log('✅ 数据库连接成功');
    
    // 4. 检查用户表是否有数据
    console.log('\n🔍 步骤4: 检查数据库表...');
    const userCount = await prisma.user.count();
    console.log(`📊 User表中有 ${userCount} 条记录`);
    
    // 5. 如果没有数据，添加测试数据
    if (userCount === 0) {
      console.log('\n🧪 步骤5: 添加测试数据...');
      
      const now = new Date();
      
      // 创建一个测试用户，对密码进行加密
      const testPassword = 'test123456';
      const hashedPassword = await bcrypt.hash(testPassword, 12);
      
      const user = await prisma.user.create({
        data: {
          uuid: `test-${Date.now()}`,
          email: `test-${Date.now()}@example.com`,
          nickname: '测试用户',
          password: hashedPassword, // 使用加密后的密码
          signinProvider: 'credentials', // 修改为credentials
          updatedAt: now, // 添加更新时间
          isDeleted: false, // 添加删除标志
        },
      });
      console.log(`✅ 测试用户创建成功: ${user.email} (密码: ${testPassword})`);
    } else {
      console.log('\n✅ 步骤5: 已有测试数据，跳过');
    }
    
    await prisma.$disconnect();
    console.log('\n🎉 测试数据库环境准备完成!');
  } catch (error) {
    console.error('\n❌ 初始化失败:', error);
    process.exit(1);
  }
}

main(); 