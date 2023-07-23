import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  define: {
    "import.meta.vitest": "undefined",
  },
  build: {
    lib: {
      entry: "./lib/index.ts",
      name: "Select",
      fileName: "select",
    },
    minify: true,
  },
  test: {
    includeSource: ["lib/**/*.{ts,js}"],
    include: [],
  },
  plugins: [dts()],
});
