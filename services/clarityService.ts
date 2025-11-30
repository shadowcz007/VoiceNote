import clarity from '@microsoft/clarity';

/**
 * 初始化 Microsoft Clarity 数据埋点
 * 仅在生产环境且配置了项目 ID 时启用
 */
export const initClarity = () => {
  // 从环境变量获取项目 ID
  const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID;
  
  // 判断是否为生产环境
  const isProduction = import.meta.env.PROD;
  
  // 仅在生产环境且配置了项目 ID 时初始化
  if (isProduction && projectId) {
    try {
      clarity.init(projectId);
      console.log('[Clarity] 数据埋点已启用');
    } catch (error) {
      console.error('[Clarity] 初始化失败:', error);
    }
  } else {
    if (!isProduction) {
      console.log('[Clarity] 开发环境，数据埋点已禁用');
    } else if (!projectId) {
      console.warn('[Clarity] 未配置项目 ID，数据埋点未启用');
    }
  }
};

