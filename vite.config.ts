import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // プロダクションビルドでソースマップを無効化
    reportCompressedSize: false, // 圧縮サイズレポートを無効化
    minify: 'esbuild', // 高速なESBuildミニファイを使用
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@headlessui/react', '@heroicons/react'],
          'vendor-utils': ['uuid']
        }
      }
    },
    target: 'esnext', // 最新のブラウザをターゲットに
    cssCodeSplit: true, // CSSコード分割を有効化
    chunkSizeWarningLimit: 1000 // チャンクサイズ警告の閾値を上げる
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'] // 主要な依存関係を事前バンドル
  }
})