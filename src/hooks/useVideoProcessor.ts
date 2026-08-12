import { useState, useCallback, useEffect } from 'react';
import { fetchVideoData, healthCheck } from '../api/client';
import type { YouTubeURLRequest, VideoDataResponse } from '../api/types';
import { validateYouTubeUrl } from '../utils/validators';
import { DEFAULT_MIN_SCRIPT_WORD_COUNT, DEFAULT_IMAGE_COUNT, LOCAL_STORAGE_KEYS } from '../utils/constants';

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
  processVideo: (urlOverride?: string) => Promise<void>;
  clearResult: () => void;
  checkServerHealth: () => Promise<boolean>;
}

const readStored = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const useVideoProcessor = (): UseVideoProcessorReturn => {
  const [url, setUrl] = useState(() => readStored<string>(LOCAL_STORAGE_KEYS.LAST_URL, ''));
  const [language, setLanguage] = useState(() => readStored<string>(LOCAL_STORAGE_KEYS.LANGUAGE, 'English'));
  const [minScriptWordCount, setMinScriptWordCount] = useState(() =>
    readStored<number>(LOCAL_STORAGE_KEYS.MIN_SCRIPT_WORDS, DEFAULT_MIN_SCRIPT_WORD_COUNT)
  );
  const [defaultImageCount, setDefaultImageCount] = useState(() =>
    readStored<number>(LOCAL_STORAGE_KEYS.DEFAULT_IMAGES, DEFAULT_IMAGE_COUNT)
  );
  const [result, setResult] = useState<VideoDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_URL, JSON.stringify(url));
    } catch { /* storage unavailable — ignore */ }
  }, [url]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, JSON.stringify(language));
    } catch { /* storage unavailable — ignore */ }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.MIN_SCRIPT_WORDS, JSON.stringify(minScriptWordCount));
    } catch { /* storage unavailable — ignore */ }
  }, [minScriptWordCount]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.DEFAULT_IMAGES, JSON.stringify(defaultImageCount));
    } catch { /* storage unavailable — ignore */ }
  }, [defaultImageCount]);

  const processVideo = useCallback(async (urlOverride?: string) => {
    const effectiveUrl = (urlOverride ?? url).trim();
    if (urlOverride !== undefined && effectiveUrl !== url) {
      setUrl(effectiveUrl);
    }

    const validation = validateYouTubeUrl(effectiveUrl);
    if (!validation.valid) {
      setError(validation.error || 'Invalid URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: YouTubeURLRequest = {
        url: effectiveUrl,
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