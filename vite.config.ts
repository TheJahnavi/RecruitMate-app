import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          "@replit/vite-plugin-cartographer" // Removed the problematic await import
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "SmartHire", "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "SmartHire", "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "SmartHire", "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "SmartHire", "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: parseInt(process.env.VITE_PORT || '5173', 10),
    host: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    // Add hmr configuration to handle connection issues
    hmr: {
      overlay: true,
    }
  },
});