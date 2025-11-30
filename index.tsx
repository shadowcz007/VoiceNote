import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initClarity } from './services/clarityService';

// 初始化 Clarity 数据埋点（在应用挂载前）
initClarity();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
