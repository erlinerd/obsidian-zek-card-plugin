import { injectable, inject } from "tsyringe";
import { TOKENS } from "@/infrastructure/di/Tokens";
import { CardScene } from "@/domain/aggregates/card-note/enums/CardScene";
import { ICardGenerationStrategyFactory } from "@/domain/aggregates/card-note/ports/ICardGenerationStrategyFactory";
import { CardGenerationStrategy } from "@/domain/services/card-generation/CardGenerationStrategy";
import { GenericCreateStrategy } from "@/domain/services/card-generation/GenericCreateStrategy";
import { IdeaCreateStrategy } from "@/domain/aggregates/card-note/services/card-creation/IdeaCreateStrategy";
import { LiteratureCreateStrategy } from "@/domain/aggregates/card-note/services/card-creation/LiteratureCreateStrategy";
import { TopicCreateStrategy } from "@/domain/aggregates/card-note/services/card-creation/TopicCreateStrategy";
import type { ITemplateRepository } from "@/domain/aggregates/template/ports/ITemplateRepository";
import type { ICardMetaProcessorPort } from "@/domain/aggregates/card-note/ports/ICardMetaProcessorPort";
import type { ISystemClockPort } from "@/domain/ports/ISystemClockPort";

@injectable()
export class CardGenerationStrategyFactoryAdapter implements ICardGenerationStrategyFactory {
  constructor(
    @inject(TOKENS.ITemplateRepository) private readonly templateRepository: ITemplateRepository,
    @inject(TOKENS.ICardMetaProcessorPort) private readonly cardMetaProcessor: ICardMetaProcessorPort,
    @inject(TOKENS.ISystemClockPort) private readonly clock: ISystemClockPort,
  ) {}

  get(scene: CardScene): CardGenerationStrategy {
    if (scene === CardScene.IDEA) {
      return new IdeaCreateStrategy(this.templateRepository, this.cardMetaProcessor, this.clock);
    }
    if (scene === CardScene.LITERATURE) {
      return new LiteratureCreateStrategy(this.templateRepository, this.cardMetaProcessor, this.clock);
    }
    if (scene === CardScene.TOPIC) {
      return new TopicCreateStrategy(this.templateRepository, this.cardMetaProcessor, this.clock);
    }
    return new GenericCreateStrategy(this.templateRepository, this.cardMetaProcessor, this.clock, scene);
  }
}
