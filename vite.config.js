import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 9000
  },
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      'js-interpreter': '/node_modules/js-interpreter/lib/index.js'
    }
  }
})
