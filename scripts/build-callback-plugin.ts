import type { Plugin } from "vite";
import * as fs from "fs";
import * as path from "path";

export interface BuildCallbackOptions {
	/**
	 * Callback invoked after build finishes
	 */
	onBuildComplete?: () => void;
	/**
	 * Whether to run the callback in dev mode
	 */
	runInDevMode?: boolean;
}

/**
 * Vite plugin to execute a callback after build completes.
 */
export function buildCallbackPlugin(
	options: BuildCallbackOptions = {}
): Plugin {
	const { onBuildComplete, runInDevMode = true } = options;

	return {
		name: "build-callback",
		writeBundle() {
			// Trigger once after build is fully written
			if (onBuildComplete) {
				// Ensure all files are flushed before running
				setTimeout(() => {
					try {
						onBuildComplete();
					} catch (error) {
						console.error("Build callback execution failed:", error);
					}
				}, 300);
			}
		},
	};
}
