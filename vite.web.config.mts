import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import { readdir, readFile } from "fs/promises";
import YAML from "yaml";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss({
			optimize: true,
		}),
		{
			name: "vault-data-proxy",
			configureServer(server) {
				const IGNORED_DIRS = new Set([
					".obsidian",
					"node_modules",
					".git",
					"dist",
					"build",
					".trash",
				]);
				const isValidScene = (s: unknown) =>
					typeof s === "string" && ["idea", "literature", "topic"].includes(s.toLowerCase());

				const vaultRoot = (() => {
					const envDir = (process.env.VAULT_DIR ?? "").trim();
					return envDir ? envDir : path.resolve(__dirname, "../..", "..", "..");
				})();

				async function walkMarkdownFiles(dir: string, out: string[] = []): Promise<string[]> {
					const entries = await readdir(dir, { withFileTypes: true });
					for (const ent of entries) {
						if (ent.isDirectory()) {
							if (IGNORED_DIRS.has(ent.name)) continue;
							await walkMarkdownFiles(path.join(dir, ent.name), out);
						} else if (ent.isFile() && ent.name.toLowerCase().endsWith(".md")) {
							out.push(path.join(dir, ent.name));
						}
					}
					return out;
				}

				function parseFrontmatter(content: string): any {
					const lines = content.split(/\r?\n/);
					if (!lines.length || lines[0].trim() !== "---") return {};
					const endIdx = lines.indexOf("---", 1);
					if (endIdx === -1) return {};
					const yamlText = lines.slice(1, endIdx).join("\n");
					try {
						return YAML.parse(yamlText) ?? {};
					} catch {
						return {};
					}
				}

				server.middlewares.use(async (req, res, next) => {
					if (!req.url || !req.url.startsWith("/api/cards")) return next();
					if (req.method && req.method.toUpperCase() !== "GET") return next();
					try {
						const files = await walkMarkdownFiles(vaultRoot);
						const items: any[] = [];
						for (const filePath of files) {
							try {
								const content = await readFile(filePath, "utf-8");
								const fm = parseFrontmatter(content);
								const typeVal = fm?.type;
								if (typeVal && String(typeVal).toLowerCase() !== "card") continue;
								const sceneVal = fm?.scene;
								if (!isValidScene(sceneVal)) continue;
								const domainsRaw = fm?.domain;
								const arr = Array.isArray(domainsRaw) ? domainsRaw.map((d: any) => String(d)) : [];
								const cleanDomains = arr.map((d) => d.replace(/^\[\[/, "").replace(/\]\]$/, ""));
								items.push({
									name: path.basename(filePath, path.extname(filePath)),
									path: path.relative(vaultRoot, filePath).split(path.sep).join("/"),
									scene: String(sceneVal).toLowerCase(),
									domain: cleanDomains,
								});
							} catch {
								/* skip unreadable file */
							}
						}
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify(items));
					} catch (e: any) {
						res.statusCode = 500;
						res.setHeader("Content-Type", "application/json");
						res.end(JSON.stringify({ error: String(e?.message ?? e) }));
					}
				});
			},
		},
	],
	base: "/",
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	optimizeDeps: {
		include: [
			"react",
			"react-dom",
			"lucide-react",
			"@radix-ui/react-dialog",
			"@radix-ui/react-dropdown-menu",
			"@radix-ui/react-tabs",
			"@radix-ui/react-sheet",
			"@radix-ui/react-tooltip",
			"@radix-ui/react-label",
			"@radix-ui/react-separator",
			"@radix-ui/react-toggle",
			"@radix-ui/react-toggle-group",
			"@radix-ui/react-select",
			"@radix-ui/react-accordion",
			"@radix-ui/react-alert-dialog",
			"@radix-ui/react-avatar",
			"@radix-ui/react-context-menu",
			"@radix-ui/react-collapsible",
			"@radix-ui/react-popover",
			"@radix-ui/react-radio-group",
			"@radix-ui/react-hover-card",
			"@radix-ui/react-switch",
			"@radix-ui/react-scroll-area",
			"cmdk",
			"embla-carousel-react",
			"recharts",
		],
	},
	server: {
		port: 3000,
		host: "localhost",
		open: true,
		cors: true,
	},
		build: {
			outDir: "./dist/web",
			emptyOutDir: true,
			rollupOptions: {
				input: {
					main: resolve(__dirname, "src/frameworks-drivers/web/index.tsx"),
				},
				output: {
					entryFileNames: "assets/[name]-[hash].js",
					chunkFileNames: "chunks/[name]-[hash].js",
					assetFileNames: "assets/[name]-[hash][extname]",
				manualChunks(id) {
					const s = id.toString();
					if (s.includes("node_modules")) {
						const m = s.match(/node_modules\/(?:@[^\/]+\/)?([^\/]+)/);
						const pkg = (m?.[1] || "vendor").toLowerCase().replace(/[^a-z0-9_-]/gi, "");
						return pkg.startsWith("react") ? "react" : pkg;
					}
					const app = s.match(/src\/frameworks-drivers\/(shared|web)\/(components|ui|features)\/([^\/]+)/);
					if (app) {
						const [, area, layer, name] = app;
						return `${area}-${layer}-${name}`.toLowerCase();
					}
				},
				},
				treeshake: "recommended",
			},
		},
});
