import { PrismaClient } from '@prisma/client';

async function teardown() {
  const prisma = new PrismaClient();
  
  try {
    // 清理测试数据（可选）
    // 如果在测试中已经清理了数据，这里可以不做操作
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('测试环境清理失败:', error);
    process.exit(1);
  }
}

export default teardown; 