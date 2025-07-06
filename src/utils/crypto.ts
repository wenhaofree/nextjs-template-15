/**
 * 加密解密工具函数
 */

/**
 * 生成哈希值
 */
export const generateHash = async (data: string): Promise<string> => {
  if (typeof window === 'undefined') {
    // 服务端使用 Node.js crypto
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(data).digest('hex');
  } else {
    // 客户端使用 Web Crypto API
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
};

/**
 * 生成 UUID v4
 */
export const generateUUID = (): string => {
  if (typeof window !== 'undefined' && 'crypto' in window && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  
  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Base64 编码
 */
export const base64Encode = (str: string): string => {
  if (typeof window !== 'undefined') {
    return btoa(str);
  } else {
    return Buffer.from(str).toString('base64');
  }
};

/**
 * Base64 解码
 */
export const base64Decode = (str: string): string => {
  if (typeof window !== 'undefined') {
    return atob(str);
  } else {
    return Buffer.from(str, 'base64').toString();
  }
};
