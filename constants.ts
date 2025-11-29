import { PromptType } from './types';

export const APP_NAME = "VoiceNote AI";
export const LOCAL_STORAGE_KEY_NOTES = "vn_ai_notes";
export const LOCAL_STORAGE_KEY_SETTINGS = "vn_ai_settings";

export const PROMPT_OPTIONS = [
  { type: PromptType.RAW, icon: '📝', label: 'Raw' },
  { type: PromptType.SUMMARY, icon: '⚡', label: 'Summary' },
  { type: PromptType.ACTION_ITEMS, icon: '✅', label: 'Tasks' },
  { type: PromptType.JOURNAL, icon: '📔', label: 'Journal' },
  { type: PromptType.EMAIL, icon: '📧', label: 'Email' },
  { type: PromptType.CODE, icon: '💻', label: 'Code' },
];
