const API_BASE_URL = 'http://localhost:8000/api';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  error?: string;
}

export interface SuccessResponse<T> extends ApiResponse<T> {
  status: 'success';
}

export interface ErrorResponse extends ApiResponse<never> {
  status: 'error';
  error: string;
}

export async function apiCall<T>(
  endpoint: string,
  body: Record<string, any>
): Promise<SuccessResponse<T> | ErrorResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
