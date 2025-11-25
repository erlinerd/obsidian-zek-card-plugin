import { CardMeta } from "@/domain/aggregates/card-note/value-objects/CardMeta";

export interface ICardMetaProcessorPort {
    processMeta(meta: CardMeta): string;
    toInnerLink(link: string): string;
}
