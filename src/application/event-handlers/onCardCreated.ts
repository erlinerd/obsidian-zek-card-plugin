/**
 * Handler: `card.created`
 *
 * Responsibilities:
 * - Present creation notice and open the new file
 * - Trigger dashboard store refresh to sync UI state
 * - Log event receipt for diagnostics
 */
import type { IEventBusPort } from "@/domain/ports/IEventPublisherPortPort";
import { container } from "tsyringe";
import { TOKENS } from "@/infrastructure/di/Tokens";
import type { ILoggerPort } from "@/domain/ports/ILoggerPort";
import type { ICardPresenterPort } from "@/domain/aggregates/card-note/ports/ICardPresenterPort";
import type { CardCreatedEvent } from "@/domain/aggregates/card-note/events/CardCreatedEvent";
import type { ICardPersistencePort } from "@/domain/aggregates/card-note/ports/ICardPersistencePort";
import { useDashboardStore } from "@/frameworks-drivers/web/viewmodels";

export function registerOnCardCreated(bus: IEventBusPort) {
	const logger = container.resolve<ILoggerPort>(TOKENS.ILoggerPort);
	const presenter = container.resolve<ICardPresenterPort>(
		TOKENS.CardPresenter
	);
    const repo = container.resolve<ICardPersistencePort>(TOKENS.ICardPersistencePort);

    bus.on("card.created", (payload: CardCreatedEvent) => {
        const fp = payload?.filePath ?? "";
        logger.info?.(`card.created ${fp}`);
        if (fp) {
            presenter.showCreated(fp, false);
            void repo.open(fp);
        }

        void useDashboardStore.getState().fetchCards();
    });
}
