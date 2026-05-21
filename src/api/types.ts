// API Request/Response Types - Mirror backend Pydantic models

export interface YouTubeURLRequest {
  url: string;
  language: string;
  min_script_word_count: number;
  default_image_count: number;
}

export interface Step {
  step_number: number;
  description: string;
  continuity_note: string;
  tone: string;
  word_count: number;
}

export interface TranscriptStepsOutput {
  video_title: string;
  total_steps: number;
  total_word_count: number;
  steps: Step[];
}

export interface StepImageAllocation {
  step_number: number;
  step_description: string;
  allocated_images: number;
  image_hints: string[];
}

export interface ImagePlacement {
  image_number: number;
  step_number: number;
  placement_context: string;
  image_prompt: string;
  scene_description: string;
}

export interface ImagePlanOutput {
  total_images: number;
  default_images: number;
  step_allocations: StepImageAllocation[];
  image_placements: ImagePlacement[];
}

export interface GeneratedImageURL {
  image_number: number;
  image_prompt: string;
  image_url: string;
  status: 'success' | 'failed';
  error: string | null;
}

export interface VideoDataResponse {
  video_id: string;
  title: string;
  description: string;
  tags: string[];
  hashtags: string;
  transcript: string;
  thumbnail_url: string | null;
  rewritten_title: string | null;
  rewritten_description: string | null;
  rewritten_hashtags: string | null;
  script_steps: TranscriptStepsOutput | null;
  final_script: string | null;
  image_plan: ImagePlanOutput | null;
  annotated_transcript: string | null;
  generated_image_urls: GeneratedImageURL[] | null;
  generated_thumbnail_url: string | null;
}

export interface ApiError {
  detail: string;
}

export type ProcessingStatus = 'idle' | 'loading' | 'success' | 'error';