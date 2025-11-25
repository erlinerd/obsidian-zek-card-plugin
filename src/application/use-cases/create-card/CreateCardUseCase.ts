/**
 * Use case: create a card
 *
 * Responsibilities:
 * - Resolve generation strategy by `scene` and build a domain `CardNote`
 * - Check existence in persistence; save when not existing
 * - Mark domain events on the entity and emit them via the event bus
 * - Return a response DTO including `filePath` and `existed` flag
 *
 * Dependencies:
 * - `ICardGenerationStrategyFactory` to obtain scene-specific strategy
 * - `ICardPersistencePort` for exists/save/open operations
 * - `IEventBusPort` to emit domain events
 * - `ILoggerPort` for structured logging
 */
import { CardGenerationParams } from "@/domain/aggregates/card-note/dto/CardGenerationParams";
import { CardScene } from "@/domain/aggregates/card-note/enums/CardScene";
import type {
	ICardPersistencePort,
	CardData,
} from "@/domain/aggregates/card-note/ports/ICardPersistencePort";
import { CreateCardResponseDTO } from "@/application/use-cases/create-card/CreateCardResponseDTO";
import type { ICardGenerationStrategyFactory } from "@/domain/aggregates/card-note/ports/ICardGenerationStrategyFactory";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "@/infrastructure/di/Tokens";
import type { IEventBusPort } from "@/domain/ports/IEventPublisherPortPort";
import type { CardNote } from "@/domain/aggregates/card-note/CardNote";
import type { ILoggerPort } from "@/domain/ports/ILoggerPort";

export type CardCreationParams = CardGenerationParams;
export type CardCreationResult = CreateCardResponseDTO;

@injectable()
export class CreateCardUseCase {
	constructor(
		@inject(TOKENS.ICardPersistencePort)
		private readonly cardRepository: ICardPersistencePort,
		@inject(TOKENS.ICardGenerationStrategyFactory)
		private readonly strategyFactory: ICardGenerationStrategyFactory,
		@inject(TOKENS.IEventBusPort) private readonly bus?: IEventBusPort,
		@inject(TOKENS.ILoggerPort) private readonly logger?: ILoggerPort
	) {}

	async execute(
		params: CardCreationParams,
		scene: CardScene
	): Promise<CardCreationResult> {
		this.logger?.info("usecase.createCard.start", { scene, params });
		const strategy = this.strategyFactory.get(scene);
		const card = await strategy.generate(params);
		this.logger?.debug("usecase.createCard.generated", {
			title: card.getTitle().getValue(),
			scene,
		});
		return await this.save(card);
	}

	private async save(card: CardNote): Promise<CardCreationResult> {
		const cardData = card.serialize();
		const fileTitle = cardData.title;
		const filePath = `${fileTitle}.md`;
		this.logger?.info("usecase.createCard.save.checkExists", { filePath });
		const existed = await this.cardRepository.exists(filePath);

		if (existed) {
			const res = { ...cardData, filePath, existed: true };
			card.markExisted(res.filePath);
			const events = card.pullDomainEvents();
			this.logger?.debug("usecase.createCard.emitEvents", {
				count: events.length,
				types: events.map((e) => e.type),
			});
			for (const evt of events) {
				this.bus?.emit(evt.type, evt);
			}
			return res;
		}
		const saved = await this.cardRepository.saveCard(cardData);
		const res = { ...cardData, filePath: saved.path, existed: false };

		card.markCreated(res.filePath);
		const events = card.pullDomainEvents();
		this.logger?.debug("usecase.createCard.emitEvents", {
			count: events.length,
			types: events.map((e) => e.type),
		});
		for (const evt of events) {
			this.bus?.emit(evt.type, evt);
		}
		return res;
	}
}
