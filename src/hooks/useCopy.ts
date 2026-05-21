import { useState, useCallback } from 'react';

interface UseCopyReturn {
  copied: boolean;
  copyText: (text: string) => Promise<boolean>;
  copyImage: (imageUrl: string) => Promise<boolean>;
}

export const useCopy = (resetDuration = 2000): UseCopyReturn => {
  const [copied, setCopied] = useState(false);

  const resetCopied = useCallback(() => {
    setCopied(false);
  }, []);

  const copyText = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(resetCopied, resetDuration);
      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  }, [resetCopied, resetDuration]);

  const copyImage = useCallback(async (imageUrl: string): Promise<boolean> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const item = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([item]);
      setCopied(true);
      setTimeout(resetCopied, resetDuration);
      return true;
    } catch (error) {
      console.error('Failed to copy image, falling back to URL:', error);
      return copyText(imageUrl);
    }
  }, [copyText, resetCopied, resetDuration]);

  return { copied, copyText, copyImage };
};

interface UseCopyForSectionsReturn {
  copiedSection: string | null;
  copyToClipboard: (text: string, section: string) => Promise<void>;
  copyImageToClipboard: (imageUrl: string, section: string) => Promise<void>;
}

export const useCopyForSections = (resetDuration = 2000): UseCopyForSectionsReturn => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const resetSection = useCallback(() => {
    setCopiedSection(null);
  }, []);

  const copyToClipboard = useCallback(async (text: string, section: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(resetSection, resetDuration);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [resetSection, resetDuration]);

  const copyImageToClipboard = useCallback(async (imageUrl: string, section: string): Promise<void> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const item = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([item]);
      setCopiedSection(section);
      setTimeout(resetSection, resetDuration);
    } catch (error) {
      console.error('Failed to copy image, copying URL instead:', error);
      await copyToClipboard(imageUrl, section);
    }
  }, [copyToClipboard, resetSection, resetDuration]);

  return { copiedSection, copyToClipboard, copyImageToClipboard };
};