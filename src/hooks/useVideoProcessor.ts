import { useState, useCallback } from 'react';
import { fetchVideoData, healthCheck } from '../api/client';
import type { YouTubeURLRequest, VideoDataResponse } from '../api/types';
import { validateYouTubeUrl } from '../utils/validators';
import { DEFAULT_MIN_SCRIPT_WORD_COUNT, DEFAULT_IMAGE_COUNT } from '../utils/constants';

interface UseVideoProcessorReturn {
  url: string;
  setUrl: (url: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  minScriptWordCount: number;
  setMinScriptWordCount: (count: number) => void;
  defaultImageCount: number;
  setDefaultImageCount: (count: number) => void;
  result: VideoDataResponse | null;
  isLoading: boolean;
  error: string | null;
  processVideo: () => Promise<void>;
  clearResult: () => void;
  checkServerHealth: () => Promise<boolean>;
}

export const useVideoProcessor = (): UseVideoProcessorReturn => {
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('English');
  const [minScriptWordCount, setMinScriptWordCount] = useState(DEFAULT_MIN_SCRIPT_WORD_COUNT);
  const [defaultImageCount, setDefaultImageCount] = useState(DEFAULT_IMAGE_COUNT);
  const [result, setResult] = useState<VideoDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processVideo = useCallback(async () => {
    const validation = validateYouTubeUrl(url);
    if (!validation.valid) {
      setError(validation.error || 'Invalid URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: YouTubeURLRequest = {
        url: url.trim(),
        language,
        min_script_word_count: minScriptWordCount,
        default_image_count: defaultImageCount,
      };

      const data = await fetchVideoData(request);
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      console.error('[ProcessVideo] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [url, language, minScriptWordCount, defaultImageCount]);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
    setUrl('');
  }, []);

  const checkServerHealth = useCallback(async (): Promise<boolean> => {
    try {
      await healthCheck();
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    url,
    setUrl,
    language,
    setLanguage,
    minScriptWordCount,
    setMinScriptWordCount,
    defaultImageCount,
    setDefaultImageCount,
    result,
    isLoading,
    error,
    processVideo,
    clearResult,
    checkServerHealth,
  };
};