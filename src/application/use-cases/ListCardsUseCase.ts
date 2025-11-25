/**
 * Use case: list all cards
 *
 * Responsibilities:
 * - Delegate to `ICardPersistencePort` to retrieve all cards
 * - Provide a stable abstraction to view-layer and controllers
 *
 * Notes:
 * - No filtering beyond repository-provided semantics
 */
import type { ICardPersistencePort, CardListItem } from "@/domain/aggregates/card-note/ports/ICardPersistencePort";
import { injectable, inject } from "tsyringe";
import { TOKENS } from "@/infrastructure/di/Tokens";

@injectable()
export class ListCardsUseCase {
  constructor(@inject(TOKENS.ICardPersistencePort) private readonly repo: ICardPersistencePort) {}
  async execute(): Promise<CardListItem[]> {
    return await this.repo.listAllCards();
  }
}
