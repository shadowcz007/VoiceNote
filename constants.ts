import { AppSettings } from './types';
import { getPromptCategories } from './utils/promptUtils';

export const APP_NAME = "VoiceNote AI";
export const LOCAL_STORAGE_KEY_NOTES = "vn_ai_notes";
export const LOCAL_STORAGE_KEY_SETTINGS = "vn_ai_settings";

/**
 * 获取Prompt选项列表（用于向后兼容）
 * @deprecated 使用 getPromptCategories 代替
 */
export const getPromptOptions = (settings?: AppSettings) => {
  const categories = getPromptCategories(settings);
  return categories.map(cat => ({
    type: cat.id,
    icon: cat.icon,
    label: cat.name
  }));
};
