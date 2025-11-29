export interface Note {
  id: string;
  createdAt: number; // Timestamp
  originalText: string;
  processedContent: string;
  promptType: PromptType;
}

export enum PromptType {
  RAW = 'Raw Record',
  SUMMARY = 'Summary',
  ACTION_ITEMS = 'Action Items',
  JOURNAL = 'Journal Entry',
  EMAIL = 'Email Draft',
  CODE = 'Code Snippet'
}

export interface AppSettings {
  siliconFlowToken: string;
}

export interface TranscriptionResponse {
  text: string;
}

export const PRESET_PROMPTS: Record<PromptType, string> = {
  [PromptType.RAW]: "Keep the text exactly as is, just fix minor punctuation.",
  [PromptType.SUMMARY]: "Summarize the following text into a concise paragraph, capturing the main points.",
  [PromptType.ACTION_ITEMS]: "Extract a list of actionable tasks and to-do items from the text. Format them as a bulleted list.",
  [PromptType.JOURNAL]: "Rewrite the text as a reflective journal entry, maintaining a personal and thoughtful tone.",
  [PromptType.EMAIL]: "Convert the spoken notes into a professional email draft.",
  [PromptType.CODE]: "Extract any technical logic or code concepts and format them as a code snippet or technical explanation."
};
