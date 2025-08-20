import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // @ = src shortcut
    },
  },
  build: {
    outDir: "dist", // output folder
    emptyOutDir: true, // clean dist folder before build
    sourcemap: false, // optional: don't generate .map files in production
    rollupOptions: {
      output: {
        // Name JS/CSS files with hash for cache busting
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
  server: {
    port: 5173, // dev server port
    open: true,
  },
});
