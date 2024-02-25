import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

const filesNeedToExclude = ["src/data/testDataDesktop.json", "src/data/testDataMobile.json"]
const filesPathToExclude = filesNeedToExclude.map((src) => {
  return fileURLToPath(new URL(src, import.meta.url))
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },

  build: {
    manifest: true,
    rollupOptions: {
      external: [...filesPathToExclude]
    }
  }
})
