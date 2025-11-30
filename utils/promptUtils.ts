import { PromptCategory, DEFAULT_PROMPT_CATEGORIES, PRESET_PROMPTS, AppSettings } from '../types';

/**
 * 获取所有类别（合并默认类别和自定义类别）
 */
export const getPromptCategories = (settings?: AppSettings): PromptCategory[] => {
  const defaultCategories = [...DEFAULT_PROMPT_CATEGORIES];
  const customCategories = settings?.customCategories || [];
  const deletedCategories = settings?.deletedCategories || [];
  
  // 合并类别，自定义类别覆盖默认类别（如果有相同id）
  const categoryMap = new Map<string, PromptCategory>();
  
  // 先添加默认类别（排除已删除的）
  defaultCategories.forEach(cat => {
    if (!deletedCategories.includes(cat.id)) {
      categoryMap.set(cat.id, { ...cat });
    }
  });
  
  // 用自定义类别覆盖或添加
  customCategories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat });
  });
  
  return Array.from(categoryMap.values());
};

/**
 * 根据id查找类别信息
 */
export const getCategoryById = (id: string, settings?: AppSettings): PromptCategory | undefined => {
  const categories = getPromptCategories(settings);
  return categories.find(cat => cat.id === id);
};

/**
 * 获取类别的prompt内容（优先使用自定义prompt）
 */
export const getPromptForCategory = (categoryId: string, settings?: AppSettings): string => {
  // 优先使用自定义prompt
  if (settings?.customPrompts && settings.customPrompts[categoryId]) {
    return settings.customPrompts[categoryId];
  }
  
  // 否则使用默认prompt
  return PRESET_PROMPTS[categoryId] || '';
};

/**
 * 检查类别是否被已有笔记使用
 */
export const isCategoryInUse = (categoryId: string, notes: Array<{ promptType: string }>): boolean => {
  return notes.some(note => note.promptType === categoryId);
};

/**
 * 获取类别的显示名称（如果类别不存在，返回原值或"已删除的类别"）
 */
export const getCategoryDisplayName = (categoryId: string, settings?: AppSettings): string => {
  const category = getCategoryById(categoryId, settings);
  return category ? category.name : categoryId || '已删除的类别';
};

/**
 * 获取类别的图标（如果类别不存在，返回默认图标）
 */
export const getCategoryIcon = (categoryId: string, settings?: AppSettings): string => {
  const category = getCategoryById(categoryId, settings);
  return category ? category.icon : '📄';
};

