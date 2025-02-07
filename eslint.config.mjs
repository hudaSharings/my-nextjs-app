import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
   // Custom ESLint rules
   {
    rules: {
      // Disable unused variable warnings (or change to "warn" to make it less strict)
      "@typescript-eslint/no-unused-vars":"off", //["error", { "argsIgnorePattern": "^_" }], // Ignores variables starting with _

      // Disable the any type warning
      "@typescript-eslint/no-explicit-any": "warn",  // Or "error" if you prefer

      // Explicit function type warnings
      "@typescript-eslint/no-unsafe-function": "warn",  // Adjust based on preference

      // Optional: You can adjust other rules here as needed
    }
  }
];

export default eslintConfig;
