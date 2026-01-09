import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import tailwindcss from '@tailwindcss/vite' // 必須導入這個

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [
        react(),
        tailwindcss(), // 必須把它加到 plugins 列表裡
      ],
    })