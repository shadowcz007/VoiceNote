import { AppSettings } from '../types';
import { getPromptForCategory } from '../utils/promptUtils';

export const processNoteContent = async (
  text: string, 
  promptType: string, 
  token: string,
  settings?: AppSettings
): Promise<string> => {
  if (!token) {
    throw new Error("SiliconFlow API Token is missing. Please configure it in Settings.");
  }

  // 使用工具函数获取prompt内容（优先使用自定义prompt）
  const promptInstruction = getPromptForCategory(promptType, settings);

  const systemInstruction = `You are an expert AI assistant helping to organize voice notes. 
  Your goal is to transform the user's raw transcribed text according to the requested format.
  
  The user's selected mode is: ${promptType}
  The specific instruction for this mode is: ${promptInstruction}
  
  Return ONLY the processed content. Do not include conversational filler like "Here is your summary".`;

  try {
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3',
        messages: [
          {
            role: 'system',
            content: systemInstruction
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    console.log('SiliconFlow API Response:', JSON.stringify(data, null, 2));
    
    // 检查响应结构
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('Invalid response structure - no choices:', data);
      throw new Error('Invalid API response: no choices found');
    }

    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      console.error('No content in response:', data);
      throw new Error('No content in API response');
    }

    console.log('Extracted content:', content);
    return content;
  } catch (error) {
    console.error("SiliconFlow processing failed:", error);
    // 抛出错误让上层处理，而不是静默返回原始文本
    throw error;
  }
};
