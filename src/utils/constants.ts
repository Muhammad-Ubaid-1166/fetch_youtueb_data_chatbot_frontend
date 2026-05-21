export const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Portuguese',
  'Russian',
  'Japanese',
  'Korean',
  'Chinese',
  'Hindi',
  'Bengali',
  'Urdu',
  'Arabic',
  'Turkish',
  'Persian',
  'Indonesian',
  'Italian',
  'Dutch',
  'Polish',
  'Thai',
  'Vietnamese',
  'Malay',
  'Tamil',
  'Telugu',
  'Punjabi',
  'Marathi',
  'Gujarati',
  'Kannada',
  'Malayalam',
  'Nepali',
  'Sinhala',
  'Hebrew',
  'Greek',
  'Czech',
  'Romanian',
  'Hungarian',
  'Ukrainian',
  'Swedish',
  'Norwegian',
  'Danish',
  'Finnish',
] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_MIN_SCRIPT_WORD_COUNT = 2500;
export const DEFAULT_IMAGE_COUNT = 15;

export const LOCAL_STORAGE_KEYS = {
  LANGUAGE: 'youtube_processor_language',
  MIN_SCRIPT_WORDS: 'youtube_processor_min_words',
  DEFAULT_IMAGES: 'youtube_processor_default_images',
  LAST_URL: 'youtube_processor_last_url',
} as const;

export const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}$/;

export const SECTION_HEADERS = {
  ORIGINAL: 'Original Video Data',
  METADATA: 'Rewritten Metadata',
  TRANSCRIPT: 'Original Transcript',
  SCRIPT_STEPS: 'Script Planning',
  FINAL_SCRIPT: 'Final Script',
  IMAGE_PLAN: 'Image Plan',
  GENERATED_IMAGES: 'Generated Images',
  ANNOTATED_TRANSCRIPT: 'Annotated Transcript',
  THUMBNAIL: 'Thumbnail Regeneration',
} as const;