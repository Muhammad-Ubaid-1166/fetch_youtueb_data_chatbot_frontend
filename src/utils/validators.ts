import { YOUTUBE_URL_REGEX } from './constants';

export const validateYouTubeUrl = (url: string): { valid: boolean; error?: string } => {
  if (!url || url.trim() === '') {
    return { valid: false, error: 'Please enter a YouTube URL' };
  }

  const trimmedUrl = url.trim();

  if (!YOUTUBE_URL_REGEX.test(trimmedUrl)) {
    return { valid: false, error: 'Invalid YouTube URL format. Please enter a valid URL like https://www.youtube.com/watch?v=...' };
  }

  return { valid: true };
};

export const extractVideoId = (url: string): string | null => {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

export const formatHashtags = (hashtags: string): string[] => {
  return hashtags
    .split(/[,\s]+/)
    .map(tag => tag.replace(/^#/, '').trim())
    .filter(tag => tag.length > 0);
};

export const formatWordCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

export const getSuccessRate = (items: Array<{ status: string }>): number => {
  if (items.length === 0) return 0;
  const successCount = items.filter(item => item.status === 'success').length;
  return Math.round((successCount / items.length) * 100);
};