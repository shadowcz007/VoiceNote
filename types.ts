export interface Note {
  id: string;
  createdAt: number; // Timestamp
  originalText: string;
  processedContent: string;
  promptType: string; // Changed from PromptType enum to string
}

// PromptType is now a string type alias for backward compatibility
export type PromptType = string;

export interface PromptCategory {
  id: string;
  name: string;
  icon: string;
  isDefault?: boolean;
}

export interface AppSettings {
  siliconFlowToken: string;
  customPrompts?: Record<string, string>;
  customCategories?: PromptCategory[];
  deletedCategories?: string[]; // 记录被删除的默认类别ID
}

export interface TranscriptionResponse {
  text: string;
}

// Default prompt categories
export const DEFAULT_PROMPT_CATEGORIES: PromptCategory[] = [
  { id: 'raw', name: 'Raw Record', icon: '📝', isDefault: true },
  { id: 'summary', name: 'Summary', icon: '⚡', isDefault: true },
  { id: 'action_items', name: 'Action Items', icon: '✅', isDefault: true },
  { id: 'journal', name: 'Journal Entry', icon: '📔', isDefault: true },
  { id: 'email', name: 'Email Draft', icon: '📧', isDefault: true },
  { id: 'code', name: 'Code Snippet', icon: '💻', isDefault: true },
];

// Default prompts mapped by category id
export const PRESET_PROMPTS: Record<string, string> = {
  'raw': "Keep the text exactly as is, just fix minor punctuation.",
  'summary': "Summarize the following text into a concise paragraph, capturing the main points.",
  'action_items': "Extract a list of actionable tasks and to-do items from the text. Format them as a bulleted list.",
  'journal': "Rewrite the text as a reflective journal entry, maintaining a personal and thoughtful tone.",
  'email': "Convert the spoken notes into a professional email draft.",
  'code': "Extract any technical logic or code concepts and format them as a code snippet or technical explanation."
};
