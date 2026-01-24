import React from 'react'
    import ReactDOM from 'react-dom/client'
    import App from './App' // 這裡引用你的遊戲組件
    import './index.css'    // 關鍵！這行必須有
    import './mobile.css'  // 移動端優化樣式

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )