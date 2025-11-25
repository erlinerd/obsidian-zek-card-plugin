import { container } from "tsyringe";
import { TOKENS } from "@/infrastructure/di/Tokens";
import { CardListQueryController } from "@/infrastructure/controllers/CardListQueryController";
import type { CardListItemDTO } from "@/frameworks-drivers/web/types";

export const webPlatformApi = {
  async listAllCards(): Promise<CardListItemDTO[]> {
    let controller: CardListQueryController;
    try {
      controller = container.resolve<CardListQueryController>(TOKENS.CardListQueryController);
    } catch {
      controller = new CardListQueryController();
    }
    return await controller.listAllCards();
  },
};

