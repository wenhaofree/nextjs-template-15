import { Pool } from 'pg';
import { config } from '../config';

const pool = new Pool({
  connectionString: config.database.url,
  ssl: config.database.ssl
});

const setupDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Starting database setup...');
    
    // 开始事务
    await client.query('BEGIN');

    // 用户表
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255),
        name VARCHAR(100),
        image TEXT,
        level VARCHAR(255) DEFAULT 'free',
        locale VARCHAR(10) DEFAULT 'en',
        profile_data JSONB,
        email_verified BOOLEAN DEFAULT FALSE,
        
        -- 安全相关字段
        verification_token VARCHAR(255),
        verification_token_expires TIMESTAMP WITH TIME ZONE,
        reset_password_token VARCHAR(255),
        reset_password_expires TIMESTAMP WITH TIME ZONE,
        failed_login_attempts INTEGER DEFAULT 0,
        last_login_attempt TIMESTAMP WITH TIME ZONE,
        account_locked BOOLEAN DEFAULT FALSE,
        account_locked_until TIMESTAMP WITH TIME ZONE,
        
        -- 双因素认证
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        two_factor_secret VARCHAR(255),
        backup_codes JSONB,
        
        -- 社交账号关联
        google_id VARCHAR(255),
        github_id VARCHAR(255),
        
        -- 审计字段
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_login_at TIMESTAMP WITH TIME ZONE,
        last_login_ip VARCHAR(45),
        
        -- 用户状态
        is_active BOOLEAN DEFAULT TRUE,
        deactivated_at TIMESTAMP WITH TIME ZONE
      );
    `);

    // 会话管理表
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) NOT NULL,
        refresh_token VARCHAR(255),
        device_info JSONB,
        ip_address VARCHAR(45),
        is_valid BOOLEAN DEFAULT TRUE,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 登录历史表
    await client.query(`
      CREATE TABLE IF NOT EXISTS login_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        login_type VARCHAR(50),
        ip_address VARCHAR(45),
        device_info JSONB,
        status VARCHAR(50),
        failure_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 创建索引
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
      CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
      CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON login_history(user_id);
      CREATE INDEX IF NOT EXISTS idx_login_history_created_at ON login_history(created_at);
    `);

    // 创建更新时间戳触发器
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      
      CREATE TRIGGER update_users_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `);

    // 提交事务
    await client.query('COMMIT');
    
    console.log('Database setup completed successfully!');
    
  } catch (error) {
    // 发生错误时回滚事务
    await client.query('ROLLBACK');
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// 运行设置
setupDatabase().catch(console.error);
