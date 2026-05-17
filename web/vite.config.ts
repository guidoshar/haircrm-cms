import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/products/",
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": "http://localhost:8088",
      "/cdn": "http://localhost:8090",
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
