import { Template } from "@/domain/aggregates/template/Template";
import { ITemplateRepository } from "@/domain/aggregates/template/ports/ITemplateRepository";
import path from "path";
import { injectable, inject } from "tsyringe";
import { TOKENS } from "@/infrastructure/di/Tokens";
import { Plugin } from "obsidian";


/**
 * Persistence adapter: read-only template repository
 *
 * Responsibilities:
 * - Read template files from the plugin `templates` directory in Obsidian vault
 * - Provide `getByFileName` using the naming convention `<fileName>-card.md`
 * - Return `Template` instances validated by the factory; `null` on failure
 */
@injectable()
export class LocalTemplateRepository implements ITemplateRepository {
	private readonly templateDir: string;

    constructor(@inject(TOKENS.Plugin) private readonly plugin?: Plugin) {
		// Template directory: expected to exist in the plugin folder
		if (!this.plugin) {
			throw new Error('Plugin instance not available for template repository');
		}
		this.templateDir = path.join(
			this.plugin.app.vault.configDir,
			"plugins",
			"obsidian-zek-card-plugin",
			"templates",
		);
	}
	async getByFileName(fileName: string): Promise<Template | null> {
		try {
			if (!this.plugin || !this.plugin.app || !this.plugin.app.vault || !this.plugin.app.vault.adapter) {
				throw new Error('Plugin instance or vault adapter not available for template repository');
			}
			const filePath = path.join(this.templateDir, `${fileName}-card.md`);
			const rawContent = await this.plugin.app.vault.adapter.read(
				filePath
			);

			if (!rawContent) {
				throw new Error(`Template ${fileName} not found or read failed`);
			}

			// Return template instance (validated by factory method)
			return Template.create(fileName, rawContent);
		} catch (err) {
			console.error(`Template ${fileName} not found or read failed`, err);
			return null;
		}
	}
}
