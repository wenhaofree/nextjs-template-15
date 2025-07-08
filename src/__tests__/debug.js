/**
 * 测试环境调试脚本
 * 用于检查Jest和Prisma配置是否正确
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('===== 测试环境调试 =====');

// 检查Jest是否可用
try {
  console.log('检查Jest版本:');
  execSync('npx jest --version', { stdio: 'inherit' });
  console.log('✅ Jest正常');
} catch (error) {
  console.error('❌ Jest未正确安装:', error.message);
}

// 检查测试环境变量
try {
  console.log('\n检查.env.test文件:');
  const envContent = fs.readFileSync('.env.test', 'utf8');
  // 隐藏敏感信息，只显示结构
  const dbUrl = envContent.match(/DATABASE_URL=(['"])(.+?)\1/);
  if (dbUrl && dbUrl[2]) {
    const sanitizedUrl = dbUrl[2].replace(/\/\/.+?@/, '//****:****@');
    console.log(`DATABASE_URL=${sanitizedUrl}`);
  } else {
    console.log('未找到DATABASE_URL配置');
  }
  console.log('✅ .env.test文件存在');
} catch (error) {
  console.error('❌ .env.test文件不存在或无法读取:', error.message);
}

// 检查Prisma是否可用
try {
  console.log('\n检查Prisma版本:');
  execSync('npx prisma --version', { stdio: 'inherit' });
  console.log('✅ Prisma正常');

  // 检查PostgreSQL服务器连接
  console.log('\n检查数据库服务器是否可访问:');
  try {
    // 从.env.test中提取数据库连接信息
    const envContent = fs.readFileSync('.env.test', 'utf8');
    const dbUrlMatch = envContent.match(/DATABASE_URL=(['"])(.+?)\1/);
    
    if (dbUrlMatch && dbUrlMatch[2]) {
      const dbUrl = dbUrlMatch[2];
      // 解析连接字符串
      const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/;
      const match = dbUrl.match(regex);
      
      if (match) {
        const host = match[3];
        const port = match[4];
        console.log(`尝试连接到数据库服务器 ${host}:${port}`);
        
        // 使用ping检查服务器是否可达
        execSync(`ping -c 1 ${host}`, { stdio: 'inherit' });
        console.log(`✅ 服务器 ${host} 可以访问`);
        
        // 检查端口是否开放
        try {
          const { execSync: execSyncWithTimeout } = require('child_process');
          execSync(`nc -z -w 5 ${host} ${port}`, { stdio: 'pipe' });
          console.log(`✅ 端口 ${port} 已开放`);
        } catch {
          console.error(`❌ 端口 ${port} 未开放或被防火墙阻止`);
        }
      }
    }
  } catch (error) {
    console.error('❌ 无法检查数据库服务器可访问性:', error.message);
  }

  console.log('\n检查数据库连接(使用.env.test):');
  try {
    execSync('npx dotenv-cli -e .env.test -- npx prisma db pull --print', { stdio: 'inherit' });
    console.log('✅ 数据库连接正常');
  } catch (error) {
    console.error('❌ 数据库连接失败');
    // 尝试不使用SSL连接
    console.log('\n尝试不使用SSL连接:');
    try {
      // 临时创建一个不带SSL的环境变量文件
      const envContent = fs.readFileSync('.env.test', 'utf8');
      const newEnvContent = envContent.replace(/\?sslmode=\w+/, '');
      fs.writeFileSync('.env.test.nossl', newEnvContent);
      
      execSync('npx dotenv-cli -e .env.test.nossl -- npx prisma db pull --print', { stdio: 'inherit' });
      console.log('✅ 无SSL连接成功，请更新.env.test移除SSL要求');
      
      // 清理临时文件
      fs.unlinkSync('.env.test.nossl');
    } catch (e) {
      console.error('❌ 无SSL连接也失败:', e.message);
    }
  }
} catch (error) {
  console.error('❌ Prisma未正确安装:', error.message);
}

console.log('\n===== 调试完成 ====='); 