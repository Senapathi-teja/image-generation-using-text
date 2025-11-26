import { AspectRatio, ModelTier } from './types';

export const APP_NAME = "Talrn AI Gen";

export const DEFAULT_PARAMS = {
  aspectRatio: AspectRatio.SQUARE,
  model: ModelTier.STANDARD,
  enhancePrompt: false,
};

// Suffixes added when "Enhance Prompt" is checked
export const ENHANCEMENT_KEYWORDS = "highly detailed, 8k resolution, cinematic lighting, photorealistic, professional photography, masterpiece, sharp focus, vibrant colors";

export const MODEL_LABELS: Record<ModelTier, string> = {
  [ModelTier.STANDARD]: 'Standard (Flash) - Fast',
  [ModelTier.PRO]: 'Pro (3.0) - High Quality',
};

export const RATIO_LABELS: Record<AspectRatio, string> = {
  [AspectRatio.SQUARE]: 'Square (1:1)',
  [AspectRatio.LANDSCAPE]: 'Landscape (16:9)',
  [AspectRatio.PORTRAIT]: 'Portrait (9:16)',
  [AspectRatio.STANDARD_LANDSCAPE]: 'Photo (4:3)',
  [AspectRatio.STANDARD_PORTRAIT]: 'Poster (3:4)',
};