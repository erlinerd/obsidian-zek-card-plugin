import { container } from "tsyringe";
import { TOKENS } from "@/infrastructure/di/Tokens";
import { CardCreationController } from "@/infrastructure/controllers/CardCreationController";

/**
 * Thin wrapper exposing card creation actions to Obsidian UI layers.
 * Resolves `CardCreationController` from DI and delegates the calls.
 */
export const obsidianPlatformApi = {
  async createIdeaCard(payload: { sourceText: string; sourceFileName: string }): Promise<void> {
    const ctrl = container.resolve<CardCreationController>(TOKENS.CardCreationController);
    await ctrl.createIdeaCard(payload);
  },
  async createLiteratureCard(payload: { sourceText: string; sourceFileName: string }): Promise<void> {
    const ctrl = container.resolve<CardCreationController>(TOKENS.CardCreationController);
    await ctrl.createLiteratureCard(payload);
  },
  async createTopicCard(payload: { sourceText: string; sourceFileName: string }): Promise<void> {
    const ctrl = container.resolve<CardCreationController>(TOKENS.CardCreationController);
    await ctrl.createTopicCard(payload);
  },
};
