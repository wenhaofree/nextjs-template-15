/**
 * 消息常量定义
 */

export const ERROR_MESSAGES = {
  // 通用错误
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  
  // 认证错误
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    EMAIL_NOT_VERIFIED: 'Please verify your email address.',
    ACCOUNT_LOCKED: 'Your account has been locked.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    PASSWORD_TOO_WEAK: 'Password is too weak.',
  },
  
  // 验证错误
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PHONE: 'Please enter a valid phone number.',
    PASSWORD_MISMATCH: 'Passwords do not match.',
    INVALID_URL: 'Please enter a valid URL.',
  },
  
  // 文件上传错误
  UPLOAD: {
    FILE_TOO_LARGE: 'File size is too large.',
    INVALID_FILE_TYPE: 'Invalid file type.',
    UPLOAD_FAILED: 'File upload failed.',
  },
} as const;

export const SUCCESS_MESSAGES = {
  // 通用成功
  GENERIC: 'Operation completed successfully.',
  SAVED: 'Changes saved successfully.',
  DELETED: 'Item deleted successfully.',
  UPDATED: 'Item updated successfully.',
  CREATED: 'Item created successfully.',
  
  // 认证成功
  AUTH: {
    LOGIN: 'Welcome back!',
    LOGOUT: 'You have been logged out.',
    REGISTER: 'Account created successfully.',
    PASSWORD_RESET: 'Password reset successfully.',
    EMAIL_VERIFIED: 'Email verified successfully.',
  },
  
  // 文件上传成功
  UPLOAD: {
    SUCCESS: 'File uploaded successfully.',
    AVATAR_UPDATED: 'Profile picture updated successfully.',
  },
} as const;

export const INFO_MESSAGES = {
  LOADING: 'Loading...',
  PROCESSING: 'Processing...',
  SAVING: 'Saving...',
  UPLOADING: 'Uploading...',
  PLEASE_WAIT: 'Please wait...',
} as const;
