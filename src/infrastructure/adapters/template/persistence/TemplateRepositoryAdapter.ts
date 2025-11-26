import { Template } from "@/domain/aggregates/template/Template";
import { ITemplateRepository } from "@/domain/aggregates/template/ports/ITemplateRepository";
import { normalizePath } from "obsidian";
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
        this.templateDir = normalizePath(
            `${this.plugin.app.vault.configDir}/plugins/obsidian-zek-card-plugin/templates`
        );
    }
    async getByFileName(fileName: string): Promise<Template | null> {
        if (!this.plugin?.app?.vault?.adapter) {
            return null;
        }
        const filePath = normalizePath(`${this.templateDir}/${fileName}-card.md`);
        const exists = await this.plugin.app.vault.adapter.exists(filePath);
        if (!exists) {
            return null;
        }
        const rawContent = await this.plugin.app.vault.adapter.read(filePath);
        if (!rawContent) {
            return null;
        }
        return Template.create(fileName, rawContent);
    }
}
