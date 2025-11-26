/**
 * Adapter: card metadata processor
 *
 * Responsibilities:
 * - Serialize domain `CardMeta` to YAML frontmatter string
 * - Convert `source` and `domain` entries to Obsidian inner-link syntax
 */
import { CardMeta } from "@/domain/aggregates/card-note/value-objects/CardMeta";
import { ICardMetaProcessorPort } from "@/domain/aggregates/card-note/ports/ICardMetaProcessorPort";
import { injectable } from "tsyringe";
import Yaml from "yaml";

@injectable()
export class CardMetaProcessorAdapter implements ICardMetaProcessorPort {
	/**
	 * Serialize metadata to YAML frontmatter with inner links for source/domain.
	 */
	processMeta(meta: CardMeta): string {
		const metaData = meta.serialize();
		const str = Yaml.stringify({
			...metaData,
			source: metaData.source.map((item) =>
				this.toInnerLink(item.toString())
			),
			domain: metaData.domain.map((item) => this.toInnerLink(item)),
		});
		return `---\n${str}\n---`;
	}
	/**
	 * Convert a text to Obsidian inner link format.
	 */
	toInnerLink(link: string): string {
		return `[[${link}]]`;
	}
}
