import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "import.meta.vitest": "undefined",
  },
  build: {
    lib: {
      entry: "./lib/main.ts",
      name: "Select",
      fileName: "select",
    },
    minify: true,
  },
  test: {
    includeSource: ["lib/**/*.{ts,js}"],
    include: [],
  },
});
