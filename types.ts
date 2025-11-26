export enum ModelTier {
  STANDARD = 'gemini-2.5-flash-image',
  PRO = 'gemini-3-pro-image-preview' // For high quality/custom sizes
}

export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  STANDARD_LANDSCAPE = '4:3',
  STANDARD_PORTRAIT = '3:4'
}

export interface GenerationParams {
  prompt: string;
  negativePrompt?: string;
  aspectRatio: AspectRatio;
  model: ModelTier;
  enhancePrompt: boolean;
}

export interface GeneratedImage {
  id: string;
  url: string; // Base64 data URL
  params: GenerationParams;
  timestamp: number;
  modelUsed: string;
}

export interface HistoryItem extends GeneratedImage {}