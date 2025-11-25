/**
 * Handler: `card.existed`
 *
 * Responsibilities:
 * - Present notice indicating the file already exists and open it
 * - Keep logging lightweight; dashboard refresh is not required here
 */
import type { IEventBusPort } from "@/domain/ports/IEventPublisherPortPort";
import { container } from "tsyringe";
import { TOKENS } from "@/infrastructure/di/Tokens";
import type { ILoggerPort } from "@/domain/ports/ILoggerPort";
import type { ICardPresenterPort } from "@/domain/aggregates/card-note/ports/ICardPresenterPort";
import type { CardExistedEvent } from "@/domain/aggregates/card-note/events/CardExistedEvent";
import type { ICardPersistencePort } from "@/domain/aggregates/card-note/ports/ICardPersistencePort";

export function registerOnCardExisted(bus: IEventBusPort) {
  const logger = container.resolve<ILoggerPort>(TOKENS.ILoggerPort);
  const presenter = container.resolve<ICardPresenterPort>(TOKENS.CardPresenter);
  const repo = container.resolve<ICardPersistencePort>(TOKENS.ICardPersistencePort);
  bus.on("card.existed", (payload: CardExistedEvent | any) => {
    const fp = (payload as any)?.filePath ?? "";
    logger.info?.(`card.existed ${fp}`);
    if (fp) {
      presenter.showCreated(fp, true);
      repo.open(fp);
    }
  });
}
