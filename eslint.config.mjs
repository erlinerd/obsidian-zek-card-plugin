import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";

export default defineConfig([
	{
		ignores: ["node_modules/**", "dist/**", "main.js"],
		files: ["src/**/*.{js|mjs|cjs|ts|mts|cts}"],
		plugins: { js, obsidianmd },
		extends: ["js/recommended"],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parser: tseslint.parser,
		},
	},
	// ...tseslint.configs.recommended,
	tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				projectService: true,
			},
		},
	},
	...obsidianmd.configs.recommended,
]);
