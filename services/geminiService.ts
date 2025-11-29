import { GoogleGenAI } from "@google/genai";
import { PromptType, PRESET_PROMPTS } from '../types';

// Initialize the client with the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const processNoteContent = async (text: string, promptType: PromptType): Promise<string> => {
  // If RAW, we might still want to do a light pass for punctuation, or just return as is.
  // For this app, let's use Gemini to "clean up" the raw text slightly even for RAW mode,
  // or strictly follow the preset prompt.
  
  const systemInstruction = `You are an expert AI assistant helping to organize voice notes. 
  Your goal is to transform the user's raw transcribed text according to the requested format.
  
  The user's selected mode is: ${promptType}
  The specific instruction for this mode is: ${PRESET_PROMPTS[promptType]}
  
  Return ONLY the processed content. Do not include conversational filler like "Here is your summary".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: text,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // Low temperature for more deterministic/factual results
      }
    });

    return response.text || text; // Fallback to original text if empty
  } catch (error) {
    console.error("Gemini processing failed:", error);
    // In case of AI failure, return the original transcribed text so the user doesn't lose data
    return text;
  }
};
