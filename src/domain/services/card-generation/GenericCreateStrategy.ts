import { CardScene } from "@/domain/aggregates/card-note/enums/CardScene";
import { CardContent } from "@/domain/aggregates/card-note/value-objects/CardContent";
import { CardMeta } from "@/domain/aggregates/card-note/value-objects/CardMeta";
import { CardTitle } from "@/domain/aggregates/card-note/value-objects/CardTitle";
import type { ITemplateRepository } from "@/domain/aggregates/template/ports/ITemplateRepository";
import { CardGenerationParams } from "@/domain/aggregates/card-note/dto/CardGenerationParams";
import { CardGenerationStrategy } from "@/domain/services/card-generation/CardGenerationStrategy";
import { CardNote } from "@/domain/aggregates/card-note/CardNote";
import type { ICardMetaProcessorPort } from "@/domain/aggregates/card-note/ports/ICardMetaProcessorPort";
import type { ISystemClockPort } from "@/domain/ports/ISystemClockPort";

interface CreateStrategyOptions {
    prefix?: string;
    templateKey?: string;
    buildVars?: (params: CardGenerationParams) => Record<string, string>;
}

export class GenericCreateStrategy implements CardGenerationStrategy {
    constructor(
        private readonly templateRepository: ITemplateRepository,
        private readonly cardMetaProcessor: ICardMetaProcessorPort,
        private readonly clock: ISystemClockPort,
        private readonly scene: CardScene,
        override?: string | CreateStrategyOptions
    ) {
        if (typeof override === "string") {
            this.options = { prefix: override };
        } else if (override) {
            this.options = override;
        }
    }

    private options?: CreateStrategyOptions;

    getCardScene(): CardScene {
        return this.scene;
    }

    getPrefix() {
        if (this.options?.prefix) return this.options.prefix;
        return "";
    }

    async generate(params: CardGenerationParams): Promise<CardNote> {
        const scene = this.getCardScene();
        const fallback = this.clock.nowCompactYmdHms();
        const prefix = this.getPrefix();
        const rawBase = params.sourceText?.trim() || fallback;
        const maxLen = 50;
        const maxBaseLen = Math.max(1, maxLen - prefix.length);
        const base = rawBase.length > maxBaseLen ? rawBase.slice(0, maxBaseLen) : rawBase;
        const finalTitle = new CardTitle(`${prefix}${base}`);

        let renderedContent = "";
        const templateKey = this.options?.templateKey || this.getCardScene();
        const template = await this.templateRepository.getByFileName(templateKey);

        if (template) {
            const vars = this.options?.buildVars
                ? this.options.buildVars(params)
                : {
                      inner: params.sourceText,
                      source: params.sourceFileName ? this.cardMetaProcessor.toInnerLink(params.sourceFileName) : "",
                      title: finalTitle.getValue(),
                      scene: scene,
                      prefix: this.getPrefix(),
                  };
            renderedContent = template.render(vars);
        } else {
            const sourceLink = params.sourceFileName ? this.cardMetaProcessor.toInnerLink(params.sourceFileName) : "";
            renderedContent = `${params.sourceText || ""}${sourceLink ? `\n${sourceLink}` : ""}`.trim();
        }

        const createdIso = this.clock.nowIso();
        const meta = new CardMeta(scene, [], [params.sourceFileName], createdIso);
        const finalContent = new CardContent(this.cardMetaProcessor.processMeta(meta) + "\n" + renderedContent);

        const card = CardNote.create({
            title: finalTitle,
            content: finalContent,
            scene,
            source: [params.sourceFileName],
            domain: [],
        });
        return card;
    }
}
