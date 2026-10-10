import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // The browser talks to :5173 only; Vite forwards /api to Express.
    // Same origin means no CORS and no cross-site cookie problems in development.
    proxy: { "/api": "http://localhost:3000" }, // use your server's real port
  },
});
