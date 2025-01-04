import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';

// 加载环境变量
dotenvConfig({
  path: join(process.cwd(), '.env.local')
});

export const config = {
  database: {
    url: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  },
  env: process.env.NODE_ENV || 'development'
};