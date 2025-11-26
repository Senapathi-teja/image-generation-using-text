import { GoogleGenAI } from "@google/genai";
import { GenerationParams, ModelTier, AspectRatio } from "../types";
import { ENHANCEMENT_KEYWORDS } from "../constants";

// Ensure API key is present
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("Missing API_KEY in environment variables");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-to-prevent-crash' });

export const generateImage = async (params: GenerationParams): Promise<string> => {
  let finalPrompt = params.prompt;
  
  // Apply prompt engineering if requested
  if (params.enhancePrompt) {
    finalPrompt = `${finalPrompt}, ${ENHANCEMENT_KEYWORDS}`;
  }

  // Handle negative prompt by appending natural language exclusion logic
  // Note: Gemini text-to-image prompt adherence is high, but explicit negative prompting 
  // varies by model version. We append it to the text prompt for best results in Flash.
  if (params.negativePrompt && params.negativePrompt.trim().length > 0) {
    finalPrompt = `${finalPrompt} --no ${params.negativePrompt}`;
  }

  try {
    const config: any = {
      imageConfig: {
        aspectRatio: params.aspectRatio,
      }
    };

    // If using Pro model, we can specify imageSize (not available in Flash-2.5-image currently)
    /* 
       Note: The system instruction says imageSize is only for gemini-3-pro-image-preview.
       Standard flash model defaults to 1024x1024 usually.
    */
    if (params.model === ModelTier.PRO) {
       // Pro model supports explicit sizing
       // Defaulting to 1K for speed, could be exposed to UI later
       config.imageConfig.imageSize = "1K"; 
    }

    const response = await ai.models.generateContent({
      model: params.model,
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: config
    });

    // Extract image from response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           const mimeType = part.inlineData.mimeType || 'image/png';
           return `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response.");
  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};