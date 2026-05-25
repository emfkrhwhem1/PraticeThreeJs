import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import tailwindcss from "@tailwindcss/vite";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      usePolling: true, // 👈 파일 변경을 주기적으로 강제 체크하도록 설정
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});
