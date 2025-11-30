import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Key, Wand2, RotateCcw, Plus, Trash2, FileText, Tag, Search, ArrowLeft, ChevronUp } from 'lucide-react';
import { AppSettings, PromptCategory, PRESET_PROMPTS, DEFAULT_PROMPT_CATEGORIES } from '../types';
import { getPromptCategories, getPromptForCategory } from '../utils/promptUtils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

// 常用emoji图标列表（去重）
const COMMON_ICONS = [
  '📝', '⚡', '✅', '📔', '📧', '💻', '📄', '📋', '📊', '📈',
  '🎯', '💡', '🔥', '⭐', '🌟', '✨', '🎨', '🎭', '🎪', '🎬',
  '📱', '⌨️', '🖥️', '🖨️', '📷', '📹', '🎥', '📺', '📻',
  '🔊', '🔉', '🔈', '📢', '📣', '📯', '🔔', '🔕', '📞', '📟',
  '💬', '💭', '🗨️', '🗯️', '📨', '📩', '📤', '📥', '📦', '📫'
];

// 独立的 IconPicker Modal 组件
const IconPickerModal: React.FC<{
  isOpen: boolean;
  currentIcon: string;
  onClose: () => void;
  onSelect: (icon: string) => void;
}> = ({ isOpen, currentIcon, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customIcon, setCustomIcon] = useState('');
  const [activeTab, setActiveTab] = useState<'emoji' | 'custom'>('emoji');

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setCustomIcon('');
      setActiveTab('emoji');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredIcons = COMMON_ICONS.filter(icon => 
    icon.includes(searchQuery) || searchQuery === ''
  );

  const handleSelect = (icon: string) => {
    onSelect(icon);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md h-[85vh] sm:max-h-[80vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 sm:zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">选择图标</h3>
          <button
            onClick={onClose}
            className="p-2 sm:p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Icon Preview */}
        <div className="p-4 sm:p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-4xl sm:text-4xl">{currentIcon || '📄'}</span>
            <div>
              <div className="text-sm font-medium text-gray-800">当前图标</div>
              <div className="text-xs text-gray-500">点击下方图标进行选择</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('emoji')}
            className={`flex-1 px-4 py-3 sm:py-2 min-h-[44px] text-sm font-medium transition-colors ${
              activeTab === 'emoji'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Emoji 图标
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 px-4 py-3 sm:py-2 min-h-[44px] text-sm font-medium transition-colors ${
              activeTab === 'custom'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            自定义
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-4">
          {activeTab === 'emoji' ? (
            <>
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索图标..."
                    className="w-full pl-10 pr-4 py-3 sm:py-2 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>
              
              {/* Icon Grid */}
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 sm:gap-3">
                {filteredIcons.map((icon, index) => (
                  <button
                    key={`${icon}-${index}`}
                    onClick={() => handleSelect(icon)}
                    className={`p-3 sm:p-3 min-h-[44px] text-2xl hover:bg-indigo-50 rounded-lg transition-all hover:scale-110 ${
                      icon === currentIcon ? 'bg-indigo-100 ring-2 ring-indigo-500' : ''
                    }`}
                    title={icon}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              {filteredIcons.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>未找到匹配的图标</p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  输入自定义图标（Emoji 或文字）
                </label>
                <input
                  type="text"
                  value={customIcon}
                  onChange={(e) => setCustomIcon(e.target.value)}
                  placeholder="例如: 🎨 或 ABC"
                  className="w-full px-4 py-3 sm:py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg"
                />
                {customIcon && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-4xl mb-2">{customIcon}</div>
                    <div className="text-xs text-gray-500">预览</div>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  if (customIcon) {
                    handleSelect(customIcon);
                  }
                }}
                disabled={!customIcon}
                className="w-full px-4 py-3 sm:py-2 min-h-[44px] bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                确认使用
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 简化的 IconPicker 按钮（用于添加新类别）
const IconPickerButton: React.FC<{
  value: string;
  onClick: () => void;
}> = ({ value, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 sm:py-2 min-h-[44px] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <span className="text-xl">{value || '📄'}</span>
      <span className="text-sm text-gray-600">选择图标</span>
    </button>
  );
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'prompts'>('settings');
  const [promptSubTab, setPromptSubTab] = useState<'content' | 'categories'>('content');
  const [token, setToken] = useState(settings.siliconFlowToken);
  const [customPrompts, setCustomPrompts] = useState<Record<string, string>>(
    settings.customPrompts || {}
  );
  const [customCategories, setCustomCategories] = useState<PromptCategory[]>(
    settings.customCategories || []
  );
  const [deletedCategories, setDeletedCategories] = useState<string[]>(
    settings.deletedCategories || []
  );
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📄');
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [editingIconCategoryId, setEditingIconCategoryId] = useState<string | null>(null);
  const [isEditingNewCategoryIcon, setIsEditingNewCategoryIcon] = useState(false);
  const [promptSearchQuery, setPromptSearchQuery] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setToken(settings.siliconFlowToken);
    setCustomPrompts(settings.customPrompts || {});
    setCustomCategories(settings.customCategories || []);
    setDeletedCategories(settings.deletedCategories || []);
    setPromptSearchQuery('');
    setCategorySearchQuery('');
  }, [settings, isOpen]);

  // 监听滚动，显示/隐藏回到顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setShowScrollTop(contentRef.current.scrollTop > 300);
      }
    };
    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll);
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen]);

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSave = () => {
    onSave({ 
      ...settings, 
      siliconFlowToken: token,
      customPrompts: Object.keys(customPrompts).length > 0 ? customPrompts : undefined,
      customCategories: customCategories.length > 0 ? customCategories : undefined,
      deletedCategories: deletedCategories.length > 0 ? deletedCategories : undefined
    });
    onClose();
  };

  const handlePromptChange = (categoryId: string, value: string) => {
    setCustomPrompts(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  const handleResetPrompt = (categoryId: string) => {
    setCustomPrompts(prev => {
      const updated = { ...prev };
      delete updated[categoryId];
      return updated;
    });
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newId = `custom_${Date.now()}`;
    const newCategory: PromptCategory = {
      id: newId,
      name: newCategoryName.trim(),
      icon: newCategoryIcon,
      isDefault: false
    };
    
    setCustomCategories(prev => [...prev, newCategory]);
    setNewCategoryName('');
    setNewCategoryIcon('📄');
  };

  const handleUpdateCategory = (categoryId: string, updates: Partial<PromptCategory>) => {
    setCustomCategories(prev => {
      // 检查类别是否已经在 customCategories 中
      const existingIndex = prev.findIndex(cat => cat.id === categoryId);
      
      if (existingIndex >= 0) {
        // 如果存在，更新它
        return prev.map(cat => cat.id === categoryId ? { ...cat, ...updates } : cat);
      } else {
        // 如果不存在（是默认类别），需要从当前所有类别中获取完整信息，然后添加
        const currentCategories = getPromptCategories({ ...settings, customCategories: prev, deletedCategories });
        const category = currentCategories.find(cat => cat.id === categoryId);
        if (category) {
          // 创建覆盖版本，保留 isDefault 标记但允许修改
          return [...prev, { ...category, ...updates }];
        }
        return prev;
      }
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = getPromptCategories({ ...settings, deletedCategories }).find(cat => cat.id === categoryId);
    const isDefault = category?.isDefault;
    
    if (isDefault) {
      if (!confirm('确定要删除默认类别吗？已有笔记仍会保留原类别信息。')) {
        return;
      }
      // 如果是默认类别，添加到 deletedCategories
      setDeletedCategories(prev => {
        const newSet = new Set(prev || []);
        newSet.add(categoryId);
        return Array.from(newSet);
      });
    } else {
      // 自定义类别：从 customCategories 中删除
      setCustomCategories(prev => prev.filter(cat => cat.id !== categoryId));
    }
    
    // 如果删除的类别有自定义prompt，也删除
    setCustomPrompts(prev => {
      const updated = { ...prev };
      delete updated[categoryId];
      return updated;
    });
  };

  // 获取所有类别（需要在 handleUpdateCategory 之前定义，但需要访问最新的 customCategories）
  // 使用 useMemo 或直接在需要时计算
  const getCurrentCategories = () => getPromptCategories({ ...settings, customCategories, deletedCategories });
  const allCategories = getCurrentCategories();

  // 获取当前正在编辑的图标
  const getCurrentIcon = (): string => {
    if (isEditingNewCategoryIcon) {
      return newCategoryIcon;
    }
    if (editingIconCategoryId) {
      const category = allCategories.find(cat => cat.id === editingIconCategoryId);
      return category?.icon || '📄';
    }
    return '📄';
  };

  // 处理图标选择
  const handleIconSelect = (icon: string) => {
    if (isEditingNewCategoryIcon) {
      setNewCategoryIcon(icon);
      setIsEditingNewCategoryIcon(false);
    } else if (editingIconCategoryId) {
      // 更新类别图标
      handleUpdateCategory(editingIconCategoryId, { icon });
      setEditingIconCategoryId(null);
    }
  };

  if (!isOpen) return null;

  // 移动端全屏，桌面端modal
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl h-screen sm:h-auto sm:max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in duration-300 flex flex-col">
        {/* 移动端导航栏 / 桌面端标题栏 */}
        <div className="flex items-center justify-between p-4 sm:p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          {/* 移动端：返回按钮 + 标题 */}
          <div className="flex items-center gap-3 sm:gap-2 flex-1 sm:flex-initial">
            <button 
              onClick={onClose} 
              className="sm:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              {activeTab === 'settings' ? (
            <Key className="w-5 h-5 text-indigo-600" />
              ) : (
                <Wand2 className="w-5 h-5 text-indigo-600" />
              )}
              <span className="sm:hidden">{activeTab === 'settings' ? 'Settings' : 'Prompts'}</span>
              <span className="hidden sm:inline">{activeTab === 'settings' ? 'Settings' : 'Prompt Management'}</span>
          </h2>
          </div>
          {/* 桌面端：关闭按钮 */}
          <button 
            onClick={onClose} 
            className="hidden sm:flex p-2 min-w-[44px] min-h-[44px] items-center justify-center hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Main Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 px-4 py-3 sm:py-3 min-h-[44px] text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Key className="w-4 h-4 inline mr-2" />
            Settings
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex-1 px-4 py-3 sm:py-3 min-h-[44px] text-sm font-medium transition-colors ${
              activeTab === 'prompts'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Wand2 className="w-4 h-4 inline mr-2" />
            <span className="hidden sm:inline">Prompt Management</span>
            <span className="sm:hidden">Prompts</span>
          </button>
        </div>

        {/* Prompt Sub-tabs */}
        {activeTab === 'prompts' && (
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setPromptSubTab('content')}
              className={`flex-1 px-4 py-3 sm:py-2 min-h-[44px] text-sm font-medium transition-colors ${
                promptSubTab === 'content'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              <span className="hidden sm:inline">Prompt Content</span>
              <span className="sm:hidden">Content</span>
            </button>
            <button
              onClick={() => setPromptSubTab('categories')}
              className={`flex-1 px-4 py-3 sm:py-2 min-h-[44px] text-sm font-medium transition-colors ${
                promptSubTab === 'categories'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Tag className="w-4 h-4 inline mr-2" />
              Categories
            </button>
          </div>
        )}
        
        {/* Tab Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto relative">
          {activeTab === 'settings' ? (
        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SiliconFlow API Token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 sm:py-2 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            <p className="mt-2 text-xs text-gray-500">
              Required for speech-to-text and text style conversion functionality. The token is stored locally on your device.
            </p>
          </div>
        </div>
          ) : promptSubTab === 'content' ? (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="mb-4 space-y-3">
                <p className="text-sm text-gray-600">
                  Customize the system prompts for each content generation type. Changes will be saved locally and used for future content generation.
                </p>
                {/* 搜索框 */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={promptSearchQuery}
                    onChange={(e) => setPromptSearchQuery(e.target.value)}
                    placeholder="搜索类别..."
                    className="w-full pl-10 pr-4 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>
              {allCategories
                .filter(category => 
                  !promptSearchQuery || 
                  category.name.toLowerCase().includes(promptSearchQuery.toLowerCase()) ||
                  category.id.toLowerCase().includes(promptSearchQuery.toLowerCase())
                )
                .map((category) => {
                const isCustom = customPrompts[category.id] !== undefined;
                const promptValue = getPromptForCategory(category.id, { ...settings, customPrompts });
                return (
                  <div key={category.id} className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <span className="text-xl sm:text-lg">{category.icon}</span>
                        <span>{category.name}</span>
                        {isCustom && (
                          <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                            Custom
                          </span>
                        )}
                      </label>
                      {isCustom && (
                        <button
                          onClick={() => handleResetPrompt(category.id)}
                          className="flex items-center gap-1 px-3 py-2 min-h-[44px] sm:min-h-0 text-sm sm:text-xs text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Reset to default"
                        >
                          <RotateCcw className="w-4 h-4 sm:w-3 sm:h-3" />
                          Reset
                        </button>
                      )}
                    </div>
                    <textarea
                      value={promptValue}
                      onChange={(e) => handlePromptChange(category.id, e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y text-sm"
                      placeholder={PRESET_PROMPTS[category.id] || 'Enter prompt instruction...'}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="mb-4 space-y-3">
                <p className="text-sm text-gray-600">
                  Manage prompt categories. You can edit names, icons, add new categories, or delete existing ones (including default categories).
                </p>
                {/* 搜索框 */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={categorySearchQuery}
                    onChange={(e) => setCategorySearchQuery(e.target.value)}
                    placeholder="搜索类别..."
                    className="w-full pl-10 pr-4 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Add New Category */}
              <div className="bg-gray-50 p-4 sm:p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Category</h3>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                  <IconPickerButton
                    value={newCategoryIcon}
                    onClick={() => {
                      setIsEditingNewCategoryIcon(true);
                      setIconPickerOpen(true);
                    }}
                  />
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="w-full sm:flex-1 px-4 py-3 sm:py-2 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCategory();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddCategory}
                    className="w-full sm:w-auto px-6 py-3 sm:py-2 min-h-[44px] bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Category List */}
              <div className="space-y-3">
                {allCategories
                  .filter(category => 
                    !categorySearchQuery || 
                    category.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
                    category.id.toLowerCase().includes(categorySearchQuery.toLowerCase())
                  )
                  .map((category) => {
                  const isEditing = editingCategory === category.id;
                  const isDefault = category.isDefault;
                  
                  return (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-4 sm:p-4">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
                            <IconPickerButton
                              value={category.icon}
                              onClick={() => {
                                setEditingIconCategoryId(category.id);
                                setIconPickerOpen(true);
                              }}
                            />
                            <input
                              type="text"
                              value={category.name}
                              onChange={(e) => handleUpdateCategory(category.id, { name: e.target.value })}
                              className="w-full sm:flex-1 px-4 py-3 sm:py-2 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                            />
                            <div className="flex gap-2 sm:flex-initial">
                              <button
                                onClick={() => setEditingCategory(null)}
                                className="flex-1 sm:flex-initial px-4 py-3 sm:py-2 min-h-[44px] bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingCategory(null)}
                                className="flex-1 sm:flex-initial px-4 py-3 sm:py-2 min-h-[44px] bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                          <div className="flex items-center gap-3 flex-1">
                            <span 
                              className="text-3xl sm:text-2xl cursor-pointer hover:scale-110 transition-transform min-w-[44px] min-h-[44px] flex items-center justify-center"
                              onClick={() => {
                                setEditingIconCategoryId(category.id);
                                setIconPickerOpen(true);
                              }}
                              title="点击修改图标"
                            >
                              {category.icon}
                            </span>
                            <div>
                              <div className="text-sm font-medium text-gray-800">{category.name}</div>
                              {isDefault && (
                                <div className="text-xs text-gray-500">Default</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => setEditingCategory(category.id)}
                              className="flex-1 sm:flex-initial px-4 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-0 text-sm sm:text-xs text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="flex-1 sm:flex-initial px-4 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-0 text-sm sm:text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex items-center justify-center gap-1 font-medium"
                            >
                              <Trash2 className="w-4 h-4 sm:w-3 sm:h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {allCategories.filter(category => 
                  !categorySearchQuery || 
                  category.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
                  category.id.toLowerCase().includes(categorySearchQuery.toLowerCase())
                ).length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">未找到匹配的类别</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 回到顶部按钮（移动端） */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 sm:hidden z-20 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all animate-in fade-in zoom-in"
            aria-label="回到顶部"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}

        <div className="p-4 sm:p-4 bg-gray-50 flex justify-end border-t border-gray-200 sticky bottom-0 z-10">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-2 min-h-[44px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Icon Picker Modal */}
      <IconPickerModal
        isOpen={iconPickerOpen}
        currentIcon={getCurrentIcon()}
        onClose={() => {
          setIconPickerOpen(false);
          setEditingIconCategoryId(null);
          setIsEditingNewCategoryIcon(false);
        }}
        onSelect={handleIconSelect}
      />
    </div>
  );
};

export default SettingsModal;
