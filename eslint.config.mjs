import { defineConfig } from "eslint/config";
import pluginNext from "@next/eslint-plugin-next";

export default defineConfig([
  {
    extends: ["next/core-web-vitals"],
    plugins: {
      next: pluginNext,
    },
    ignorePatterns: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts"
    ],
    rules: {
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error"
    }
  }
]);
