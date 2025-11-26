import { UserConfig, defineConfig } from "vite";
import { resolve } from "path";
import builtins from "builtin-modules";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { buildCallbackPlugin } from "./scripts/build-callback-plugin";
import fs from "fs";
import path from "path";
import eslintPlugin from "vite-plugin-eslint";

export default defineConfig(({ mode }) => {
	const prod = mode === "production";

	return {
		plugins: [
			eslintPlugin(),
			react(),
			tailwindcss({
				optimize: true,
			}),
			buildCallbackPlugin({
				onBuildComplete: () => {
					console.log("✅ 构建完成，正在复制文件...");
					const sourceDir = path.join(__dirname, "dist/obsidian");
					const targetDir = __dirname;
					const copyIfExists = (src: string, dest: string) => {
						if (fs.existsSync(src))
							fs.cpSync(src, dest, { recursive: true });
					};
					["main.js", "styles.css"].forEach((file) => {
						copyIfExists(
							path.join(sourceDir, file),
							path.join(targetDir, file)
						);
					});
					copyIfExists(
						path.join(sourceDir, "chunks"),
						path.join(targetDir, "chunks")
					);
					console.log("✅ 文件复制完成");
				},
				runInDevMode: true,
			}),
		],
		resolve: {
			alias: {
				"@": resolve(__dirname, "./src"),
			},
		},
		build: {
			watch: prod
				? null
				: {
						include: ["src/**/*"],
						exclude: ["node_modules/**/*"],
				  }, // enable watch only in development mode
			lib: {
				entry: resolve(
					__dirname,
					"src/frameworks-drivers/obsidian/main.ts"
				),
				name: "main",
				fileName: () => "main.js",
				formats: ["cjs"],
			},
			minify: prod,
			sourcemap: prod ? false : "inline",
			outDir: "./dist/obsidian",
			cssCodeSplit: false,
			emptyOutDir: true,
			rollupOptions: {
				input: {
					main: resolve(
						__dirname,
						"src/frameworks-drivers/obsidian/main.ts"
					),
				},
				output: {
					entryFileNames: "main.js",
					assetFileNames: "styles.css",
					inlineDynamicImports: true,
				},
				external: [
					"obsidian",
					"electron",
					"@codemirror/autocomplete",
					"@codemirror/collab",
					"@codemirror/commands",
					"@codemirror/language",
					"@codemirror/lint",
					"@codemirror/search",
					"@codemirror/state",
					"@codemirror/view",
					"@lezer/common",
					"@lezer/highlight",
					"@lezer/lr",
					...builtins,
				],
				treeshake: prod ? "recommended" : false,
			},
		},
	} satisfies UserConfig;
});
