import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Do not mark axios as external so it gets bundled properly
      external: [], // Remove "axios" from here
    },
  },
});
