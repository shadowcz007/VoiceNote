<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1RO483SBX_XJDSEfEKewIPdKMapmpRZ0m

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 环境变量配置

创建 `.env.local` 文件（或 `.env` 文件）并配置以下变量：

```env
# Gemini API Key (可选)
GEMINI_API_KEY=your_gemini_api_key_here

# Microsoft Clarity 项目 ID (用于生产环境数据埋点)
# 获取方式：访问 https://clarity.microsoft.com/ 创建项目后获取
# 注意：Clarity 仅在生产环境（npm run build）时启用，开发环境自动禁用
VITE_CLARITY_PROJECT_ID=ue15d7k2se
```

### Microsoft Clarity 数据埋点

本项目集成了 Microsoft Clarity 用于用户行为数据分析和埋点。

- **开发环境**：自动禁用，不会收集数据
- **生产环境**：需要设置 `VITE_CLARITY_PROJECT_ID` 环境变量才会启用
- 如果未设置项目 ID，应用会正常运行，只是不会进行数据埋点

获取 Clarity 项目 ID：
1. 访问 [Microsoft Clarity](https://clarity.microsoft.com/)
2. 使用 Microsoft 或 Google 账号登录
3. 创建新项目并填写网站 URL
4. 在项目设置中获取项目 ID
