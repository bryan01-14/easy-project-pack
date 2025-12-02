import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Important pour Render
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'easy-project-pack.onrender.com',
      'localhost',
      '.onrender.com' // Autorise tous les sous-domaines Render
    ]
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'easy-project-pack.onrender.com',
      'localhost',
      '.onrender.com'
    ]
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
