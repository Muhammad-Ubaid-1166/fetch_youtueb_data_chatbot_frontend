# Frontend Rewrite Implementation Plan

## Project Overview
Complete rewrite of the YouTube Content Processor frontend to align with the FastAPI backend at `http://localhost:8000/fetch-video-data`.

## Backend API Contract

### Endpoint
```
POST /fetch-video-data
```

### Request Body
```typescript
interface YouTubeURLRequest {
  url: string;                    // YouTube video URL
  language: string;               // Target language (default: "English")
  min_script_word_count: number;  // Minimum script words (default: 2500)
  default_image_count: number;    // Target images (default: 15)
}
```

### Response Structure
```typescript
interface VideoDataResponse {
  // Original fetched data
  video_id: string;
  title: string;
  description: string;
  tags: string[];
  hashtags: string;
  transcript: string;
  thumbnail_url: string | null;

  // Rewritten metadata (3-4% variation)
  rewritten_title: string | null;
  rewritten_description: string | null;
  rewritten_hashtags: string | null;

  // Script planning
  script_steps: {
    video_title: string;
    total_steps: number;
    total_word_count: number;
    steps: Array<{
      step_number: number;
      description: string;
      continuity_note: string;
      tone: string;
      word_count: number;
    }>;
  } | null;

  // Final polished script
  final_script: string | null;

  // Image planning
  image_plan: {
    total_images: number;
    default_images: number;
    step_allocations: Array<{
      step_number: number;
      step_description: string;
      allocated_images: number;
      image_hints: string[];
    }>;
    image_placements: Array<{
      image_number: number;
      step_number: number;
      placement_context: string;
      image_prompt: string;
      scene_description: string;
    }>;
  } | null;

  // Annotated transcript with [image-N] markers
  annotated_transcript: string | null;

  // Generated images
  generated_image_urls: Array<{
    image_number: number;
    image_prompt: string;
    image_url: string;
    status: string;
    error: string | null;
  }> | null;

  // Regenerated thumbnail
  generated_thumbnail_url: string | null;
}
```

## Phase 1: Project Setup & TypeScript

### Folder Structure
```
src/
├── api/
│   ├── client.ts           # Axios instance with interceptors
│   ├── endpoints.ts        # API endpoint definitions
│   └── types.ts            # TypeScript interfaces
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── CopyButton.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   └── Select.tsx
│   ├── sections/           # Display sections
│   │   ├── MetadataSection.tsx
│   │   ├── TranscriptSection.tsx
│   │   ├── ScriptStepsSection.tsx
│   │   ├── FinalScriptSection.tsx
│   │   ├── ImagePlanSection.tsx
│   │   ├── GeneratedImagesSection.tsx
│   │   └── ThumbnailSection.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── FormSection.tsx
├── hooks/
│   ├── useVideoProcessor.ts    # Main processing hook
│   ├── useCopy.ts              # Clipboard operations
│   └── useLocalStorage.ts      # Persistence
├── utils/
│   ├── constants.ts            # Language list, etc.
│   ├── formatters.ts           # Text formatting helpers
│   └── validators.ts           # URL validation
├── context/
│   └── AppContext.tsx          # Global state provider
├── App.tsx
├── main.tsx
└── index.css
```

### Key Decisions

1. **TypeScript First**: All components use strict typing
2. **Modular Components**: Each display section is isolated
3. **Custom Hooks**: Business logic extracted into reusable hooks
4. **Context API**: For global state (form data, settings)
5. **Axios with Interceptors**: For consistent error handling

## Phase 2: API Integration

### Data Mapping Strategy
The frontend must map backend response to display components:

```
Backend Response          →  Display Component
─────────────────────────────────────────────
video_id, thumbnail_url   →  Video Info Header
title, description       →  Original Data (collapsible)
rewritten_title          →  MetadataSection
rewritten_description    →  MetadataSection
rewritten_hashtags       →  MetadataSection
transcript               →  TranscriptSection
script_steps             →  ScriptStepsSection
final_script             →  FinalScriptSection
image_plan               →  ImagePlanSection
generated_image_urls     →  GeneratedImagesSection
generated_thumbnail_url  →  ThumbnailSection
```

## Phase 3: Component Implementation

### Core Components
1. **Button**: Variants (primary, secondary, ghost), sizes, loading state
2. **Card**: Header with gradient, body with padding, hover effects
3. **CopyButton**: Clipboard API with visual feedback
4. **Skeleton**: Loading placeholders matching final layout
5. **Badge**: For hashtags and tags
6. **Input/Select**: Form elements with validation

### Display Sections
1. **MetadataSection**: Shows rewritten title, description, hashtags
2. **TranscriptSection**: Full transcript with scroll
3. **ScriptStepsSection**: Accordion showing each step
4. **FinalScriptSection**: Polished script display
5. **ImagePlanSection**: Step allocations + placements
6. **GeneratedImagesSection**: Grid of generated images
7. **ThumbnailSection**: Original + regenerated thumbnail

## Phase 4: State Management

### Context Structure
```typescript
interface AppState {
  // Form state
  url: string;
  language: string;
  minScriptWordCount: number;
  defaultImageCount: number;

  // Response data
  result: VideoDataResponse | null;

  // UI state
  isLoading: boolean;
  error: string | null;
  isEditing: boolean;
}
```

### Actions
- SET_URL, SET_LANGUAGE, SET_CONFIG
- SET_RESULT, CLEAR_RESULT
- SET_LOADING, SET_ERROR
- TOGGLE_EDIT

## Phase 5: Polish & UX

### Loading States
- Global skeleton during processing
- Per-section loading states
- Progress indicators where applicable

### Error Handling
- Network errors with retry option
- Validation errors inline
- API error messages from backend
- Error boundary for component crashes

### Responsive Design
- Mobile-first approach
- Collapsible sections for space
- Touch-friendly interactions

## Migration Strategy

1. **Step 1**: Fix API client (change endpoint + response mapping)
2. **Step 2**: Create folder structure
3. **Step 3**: Build UI components
4. **Step 4**: Implement hooks
5. **Step 5**: Create display sections
6. **Step 6**: Wire everything in App.tsx
7. **Step 7**: Test and polish

## Performance Considerations

1. **Lazy Loading**: Images loaded on demand
2. **Memoization**: Expensive computations cached
3. **Code Splitting**: Route-based (if multiple pages)
4. **Virtualization**: For long lists (script steps, images)

## Code Quality Standards

1. ESLint + Prettier for formatting
2. Strict TypeScript (no `any`)
3. JSDoc for complex functions
4. Unit tests for critical logic
5. Consistent naming conventions