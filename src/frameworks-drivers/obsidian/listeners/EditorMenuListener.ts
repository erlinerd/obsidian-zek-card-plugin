import { TFile, Plugin } from "obsidian";
import { obsidianPlatformApi } from "@/frameworks-drivers/obsidian/app/ObsidianPlatformApi";

/**
 * Register editor-context menu entries for Markdown files.
 * Adds three actions to create different card types using the selected text.
 */
export function registerEditorMenuListeners(plugin: Plugin) {
	plugin.registerEvent(
		plugin.app.workspace.on("editor-menu", (menu, editor, view) => {
			// Only apply to Markdown files
			if (
				view.file &&
				view.file instanceof TFile &&
				view.file.extension === "md"
			) {
				menu.addSeparator();

				const sourceText = editor.getSelection();
				const sourceFileName = view.file?.basename;

				// Idea card
				menu.addItem((item) => {
					item.setTitle("创建💡闪念卡片")
						.setIcon("zap")
						.onClick(() => {
							void obsidianPlatformApi.createIdeaCard({
								sourceText,
								sourceFileName,
							});
						});
				});

				// Literature card
				menu.addItem((item) => {
					item.setTitle("创建📖文献卡片")
						.setIcon("book-marked")
						.onClick(() => {
							void obsidianPlatformApi.createLiteratureCard({
								sourceText,
								sourceFileName,
							});
						});
				});

				// Topic card
				menu.addItem((item) => {
					item.setTitle("创建🎯观点卡片")
						.setIcon("lightbulb")
						.onClick(() => {
							void obsidianPlatformApi.createTopicCard({
								sourceText,
								sourceFileName,
							});
						});
				});
			}
		})
	);
}
