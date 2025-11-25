import { CardNote } from "@/domain/aggregates/card-note/CardNote";
import { CardScene } from "@/domain/aggregates/card-note/enums/CardScene";
import { CardGenerationParams } from "@/domain/aggregates/card-note/dto/CardGenerationParams";

/**
 * Card generation strategy — domain-level interface contract.
 * All concrete strategies must implement this to enforce consistency.
 */
export interface CardGenerationStrategy {
	/**
	 * Get the card scene for this strategy
	 */
	getCardScene(): CardScene;

	getPrefix(): string;
	/**
	 * Generate the card entity
	 * @param params generation parameters
	 * @returns domain entity CardNote
	 */
	generate(params: CardGenerationParams): Promise<CardNote>;
}
