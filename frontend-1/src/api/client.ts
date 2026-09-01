import axios, { AxiosError, AxiosInstance } from 'axios';
import { ApiError } from '@/types';

// Default to http://localhost:8080/api/v1 as specified, or use environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  },
});

// Response interceptor to format errors into standard ApiError shape
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const traceId = (error.response?.headers && error.response.headers['x-trace-id']) || `trc-${Math.random().toString(36).substring(2, 10)}`;
    
    if (error.response && error.response.data) {
      const data = error.response.data;
      const apiError: ApiError = {
        timestamp: data.timestamp || new Date().toISOString(),
        status: error.response.status,
        code: data.code || `ERR_${error.response.status}`,
        message: data.message || error.message || 'An unexpected error occurred from PhishShield API',
        fieldErrors: data.fieldErrors,
        traceId: data.traceId || traceId,
      };
      return Promise.reject(apiError);
    }

    // Network / timeout error
    const fallbackError: ApiError = {
      timestamp: new Date().toISOString(),
      status: error.status || 0,
      code: error.code || 'NETWORK_ERROR',
      message: error.message === 'Network Error' 
        ? `Unable to connect to PhishShield API at ${BASE_URL}. Running in demo/simulated mode.` 
        : (error.message || 'Network request failed'),
      traceId,
    };

    return Promise.reject(fallbackError);
  }
);

export function isApiError(error: any): error is ApiError {
  return (
    error &&
    typeof error === 'object' &&
    typeof error.message === 'string' &&
    typeof error.traceId === 'string'
  );
}
