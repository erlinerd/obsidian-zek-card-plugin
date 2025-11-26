/**
 * Persistence adapter: Obsidian vault card repository
 *
 * Responsibilities:
 * - Save card content to a Markdown file and return its path
 * - Check file existence and open files in Obsidian workspace
 * - List all cards by scanning Markdown files and filtering by frontmatter
 *   - Only type `card` with a valid `scene` are included
 *   - Extract domains and strip Obsidian inner link brackets
 */
import { ICardPersistencePort, CardData, CardSaveResult, CardListItem } from "@/domain/aggregates/card-note/ports/ICardPersistencePort";
import { injectable, inject } from "tsyringe";
import { TOKENS } from "@/infrastructure/di/Tokens";
import type { ILoggerPort } from "@/domain/ports/ILoggerPort";
import { Plugin, TFile } from "obsidian";
import { CardScene, isValidCardScene } from "@/domain/aggregates/card-note/enums/CardScene";

@injectable()
export class CardRepositoryAdapter implements ICardPersistencePort {
    constructor(
        @inject(TOKENS.Plugin) private readonly plugin: Plugin,
        @inject(TOKENS.ILoggerPort) private readonly logger: ILoggerPort
    ) {}

    async saveCard(cardData: CardData): Promise<CardSaveResult> {
        const filePath = `${cardData.title}.md`;

        this.logger.info(`Saving card: `, cardData);

        const existed = this.plugin.app.vault.getAbstractFileByPath(filePath);
        if (existed) {
            return { path: filePath };
        }
        await this.plugin.app.vault.create(filePath, cardData.content);
        return { path: filePath };
    }

    exists(path: string): Promise<boolean> {
        return Promise.resolve(Boolean(this.plugin.app.vault.getAbstractFileByPath(path)));
    }

    async open(path: string): Promise<void> {
        const file = this.plugin.app.vault.getAbstractFileByPath(path);
        if (file && file instanceof TFile) {
            await this.plugin.app.workspace.getLeaf(true).openFile(file);
        }
    }

    listAllCards(): Promise<CardListItem[]> {
        const files = this.plugin.app.vault.getMarkdownFiles();
        const result: CardListItem[] = [];
        for (const file of files) {
            const cache = this.plugin.app.metadataCache.getFileCache(file);
            const fm = cache?.frontmatter as Record<string, unknown> | undefined;
            const typeVal = fm?.type as string | undefined;
            if (typeVal && String(typeVal).toLowerCase() !== "card") continue;
            const sceneVal = fm?.scene as string | undefined;
            if (!sceneVal || !isValidCardScene(sceneVal)) continue;
            const domainsRaw = fm?.domain as unknown;
            const domainsArr: string[] = Array.isArray(domainsRaw)
                ? (domainsRaw as unknown[]).map((d) => String(d))
                : [];
            const cleanDomains = domainsArr.map((d) => d.replace(/^\[\[/, "").replace(/\]\]$/, ""));
            result.push({
                name: file.basename,
                path: file.path,
                scene: sceneVal as CardScene,
                domain: cleanDomains,
            });
        }
        return Promise.resolve(result);
    }

}
