/**
 * API 工具函数
 */

/**
 * API 响应类型
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

/**
 * 创建 API 请求函数
 */
export const createApiRequest = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    return {
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data.message || 'Request failed',
      message: data.message,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
};

/**
 * GET 请求
 */
export const apiGet = <T = any>(url: string): Promise<ApiResponse<T>> => {
  return createApiRequest<T>(url, { method: 'GET' });
};

/**
 * POST 请求
 */
export const apiPost = <T = any>(
  url: string,
  data?: any
): Promise<ApiResponse<T>> => {
  return createApiRequest<T>(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PUT 请求
 */
export const apiPut = <T = any>(
  url: string,
  data?: any
): Promise<ApiResponse<T>> => {
  return createApiRequest<T>(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * DELETE 请求
 */
export const apiDelete = <T = any>(url: string): Promise<ApiResponse<T>> => {
  return createApiRequest<T>(url, { method: 'DELETE' });
};
