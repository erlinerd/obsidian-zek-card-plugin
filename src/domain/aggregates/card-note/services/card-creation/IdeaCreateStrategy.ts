import { CardScene } from "@/domain/aggregates/card-note/enums/CardScene";
import type { ITemplateRepository } from "@/domain/aggregates/template/ports/ITemplateRepository";
import type { ICardMetaProcessorPort } from "@/domain/aggregates/card-note/ports/ICardMetaProcessorPort";
import type { ISystemClockPort } from "@/domain/ports/ISystemClockPort";
import { CardGenerationStrategy } from "@/domain/services/card-generation/CardGenerationStrategy";
import { CardGenerationParams } from "@/domain/aggregates/card-note/dto/CardGenerationParams";
import { CardNote } from "@/domain/aggregates/card-note/CardNote";
import { GenericCreateStrategy } from "@/domain/services/card-generation/GenericCreateStrategy";

export class IdeaCreateStrategy implements CardGenerationStrategy {
  private readonly delegate: GenericCreateStrategy;
  constructor(
    templateRepository: ITemplateRepository,
    cardMetaProcessor: ICardMetaProcessorPort,
    clock: ISystemClockPort
  ) {
    this.delegate = new GenericCreateStrategy(
      templateRepository,
      cardMetaProcessor,
      clock,
      CardScene.IDEA,
      { prefix: "💡idea_", templateKey: "idea" }
    );
  }
  getCardScene(): CardScene { return CardScene.IDEA; }
  getPrefix(): string { return this.delegate.getPrefix(); }
  async generate(params: CardGenerationParams): Promise<CardNote> { return this.delegate.generate(params); }
}
