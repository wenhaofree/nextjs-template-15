import { Pool } from 'pg';
import { hash } from 'bcryptjs';
import { config } from '../config';

const pool = new Pool({
  connectionString: config.database.url,
  ssl: config.database.ssl
});

const seedDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Starting database seeding...');
    
    // 开始事务
    await client.query('BEGIN');

    // 创建测试用户
    const testUsers = [
      {
        email: 'admin@example.com',
        password: 'Admin123!@#',
        name: 'Admin User',
        level: 'admin',
        locale: 'en',
        email_verified: true,
        is_active: true
      },
      {
        email: 'test@example.com',
        password: 'Test123!@#',
        name: 'Test User',
        level: 'free',
        locale: 'zh',
        email_verified: true,
        is_active: true
      },
      {
        email: 'premium@example.com',
        password: 'Premium123!@#',
        name: 'Premium User',
        level: 'premium',
        locale: 'en',
        email_verified: true,
        is_active: true
      }
    ];

    // 插入测试用户
    for (const user of testUsers) {
      const hashedPassword = await hash(user.password, 12);
      
      await client.query(`
        INSERT INTO users (
          email, 
          password_hash, 
          name, 
          level, 
          locale, 
          email_verified, 
          is_active,
          profile_data
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (email) 
        DO UPDATE SET
          password_hash = EXCLUDED.password_hash,
          name = EXCLUDED.name,
          level = EXCLUDED.level,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `, [
        user.email,
        hashedPassword,
        user.name,
        user.level,
        user.locale,
        user.email_verified,
        user.is_active,
        JSON.stringify({ bio: `Test ${user.level} user bio` })
      ]);
    }

    // 插入一些测试登录历史
    const testUser = await client.query('SELECT id FROM users WHERE email = $1', ['test@example.com']);
    if (testUser.rows.length > 0) {
      const userId = testUser.rows[0].id;
      
      // 添加登录历史记录
      await client.query(`
        INSERT INTO login_history (
          user_id,
          login_type,
          ip_address,
          device_info,
          status,
          created_at
        ) VALUES
        ($1, 'password', '127.0.0.1', $2, 'success', NOW() - INTERVAL '1 day'),
        ($1, 'google', '127.0.0.1', $3, 'success', NOW() - INTERVAL '2 days'),
        ($1, 'password', '127.0.0.1', $4, 'failed', NOW() - INTERVAL '3 days')
      `, [
        userId,
        JSON.stringify({ browser: 'Chrome', os: 'Windows' }),
        JSON.stringify({ browser: 'Chrome', os: 'MacOS' }),
        JSON.stringify({ browser: 'Firefox', os: 'Linux' })
      ]);
    }

    // 提交事务
    await client.query('COMMIT');
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    // 发生错误时回滚事务
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// 运行种子数据插入
seedDatabase().catch(console.error);
