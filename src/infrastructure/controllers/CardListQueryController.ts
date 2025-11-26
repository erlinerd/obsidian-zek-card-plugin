import { ListCardsUseCase } from "@/application/use-cases/ListCardsUseCase";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "@/infrastructure/di/Tokens";
import type { ILoggerPort } from "@/domain/ports/ILoggerPort";
import type { CardListItemDTO } from "@/frameworks-drivers/web/types";

/**
 * Controller: card list query
 *
 * Responsibilities:
 * - Invoke `ListCardsUseCase` to fetch all cards
 * - Map domain results to view-layer DTO shape
 * - Log query lifecycle and errors
 */
@injectable()
export class CardListQueryController {
	constructor(
		@inject(TOKENS.ListCardsUseCase) private useCase?: ListCardsUseCase,
		@inject(TOKENS.ILoggerPort) private logger?: ILoggerPort
	) {}

    async listAllCards(): Promise<CardListItemDTO[]> {
        this.logger?.info("开始查询所有卡片");
        const uc = this.useCase;
        if (!uc) {
            const err = new Error("ListCardsUseCase 未注入到 CardListQueryController");
            this.logger?.error("查询失败", err);
            throw err;
        }
        const items = await uc.execute();
        this.logger?.info(`查询到 ${items.length} 条卡片`);
        return items.map((it) => ({
          name: it.name,
          path: it.path,
          scene: it.scene,
          domain: it.domain,
        }));
    }
}
