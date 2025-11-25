import { CardScene } from "@/domain/aggregates/card-note/enums/CardScene";
import { CardGenerationStrategy } from "@/domain/services/card-generation/CardGenerationStrategy";

export interface ICardGenerationStrategyFactory {
  get(scene: CardScene): CardGenerationStrategy;
}
