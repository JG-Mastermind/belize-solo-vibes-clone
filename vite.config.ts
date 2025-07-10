
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react()];
  
  if (mode === 'development') {
    try {
      // Dynamic import to avoid ESM issues
      const { componentTagger } = await import('lovable-tagger');
      plugins.push(componentTagger());
    } catch (error: unknown) {
      console.warn('lovable-tagger not available:', (error as Error).message);
    }
  }
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    preview: {
      port: 8080,
      host: true
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
