import axios, { AxiosError, AxiosResponse } from 'axios';
import type { YouTubeURLRequest, VideoDataResponse, ApiError } from './types';

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';

const resolveApiBaseUrl = (): string => {
  const candidates = [RAW_API_BASE_URL, 'http://localhost:8000'];
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const parsed = new URL(candidate);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.toString().replace(/\/+$/, '');
      }
    } catch {
      console.warn(`[API] Invalid API base URL ignored: "${candidate}"`);
    }
  }
  return 'http://localhost:8000';
};

const API_BASE_URL = resolveApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse<VideoDataResponse>) => {
    console.log(`[API] Response received:`, response.status);
    return response;
  },
  (error: AxiosError<ApiError | { detail: Array<{ loc: string[]; msg: string; type: string }> }>) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      console.error(`[API Error] ${status}:`, data || error.message);

      if (status === 422 && data && 'detail' in data && Array.isArray(data.detail)) {
        const messages = data.detail
          .map((err) => `${err.loc.slice(1).join('.')}: ${err.msg}`)
          .join('; ');
        throw new Error(`Validation Error: ${messages}`);
      }

      if (status === 400) {
        const msg = typeof data === 'object' && data !== null && 'detail' in data
          ? (data as ApiError).detail
          : 'Invalid request. Please check the YouTube URL.';
        throw new Error(msg);
      }
      if (status === 404) {
        const msg = typeof data === 'object' && data !== null && 'detail' in data
          ? (data as ApiError).detail
          : 'Video not found or metadata inaccessible.';
        throw new Error(msg);
      }
      if (status === 500) {
        const msg = typeof data === 'object' && data !== null && 'detail' in data
          ? (data as ApiError).detail
          : 'Internal server error. Please try again later.';
        throw new Error(msg);
      }

      const detail = typeof data === 'object' && data !== null && 'detail' in data
        ? (data as ApiError).detail
        : null;
      throw new Error(detail || `Server error (${status})`);
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. The server took too long to respond.');
    }

    if (error.code === 'ERR_NETWORK') {
      throw new Error('Could not reach the server. Please try again.');
    }

    throw new Error(error.message || 'An unexpected error occurred.');
  }
);

export const fetchVideoData = async (request: YouTubeURLRequest): Promise<VideoDataResponse> => {
  const response = await apiClient.post<VideoDataResponse>('/fetch-video-data', request);
  return response.data;
};

export const healthCheck = async (): Promise<{ status: string }> => {
  const response = await apiClient.get<{ status: string }>('/health');
  return response.data;
};