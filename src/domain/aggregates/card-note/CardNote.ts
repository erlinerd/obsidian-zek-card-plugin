import { CardScene } from "@/domain/aggregates/card-note/enums/CardScene";
import { CardContent } from "@/domain/aggregates/card-note/value-objects/CardContent";
import { CardMeta } from "@/domain/aggregates/card-note/value-objects/CardMeta";
import { CardTitle } from "@/domain/aggregates/card-note/value-objects/CardTitle";
import type { CardData } from "@/domain/aggregates/card-note/ports/ICardPersistencePort";
import type { DomainEvent } from "@/domain/events/BaseEvent";
import { CardCreatedEvent } from "@/domain/aggregates/card-note/events/CardCreatedEvent";
import { CardExistedEvent } from "@/domain/aggregates/card-note/events/CardExistedEvent";

export class CardNote {
	private title: CardTitle; // card title
	private meta: CardMeta; // card metadata
	private content: CardContent; // card content
	private domainEvents: DomainEvent[] = [];

	/**
	 * Card constructor
	 * @param title card title
	 * @param meta card metadata input
	 * @param content card content
	 */
	private constructor({
		title,
		content,
		scene,
		source,
		domain,
	}: {
		title: CardTitle;
		content: CardContent;
		scene: CardScene;
		source: string[];
		domain: string[];
	}) {
		this.content = content;
		this.meta = new CardMeta(scene, domain, source);
		this.title = title;
	}

	static create(input: {
		title: CardTitle;
		content: CardContent;
		scene: CardScene;
		source: string[];
		domain: string[];
	}): CardNote {
		return new CardNote(input);
	}

	updateContent(newContent: CardContent): void {
		this.content = newContent;
	}
	getTitle(): CardTitle {
		return this.title;
	}
	getMeta(): CardMeta {
		return this.meta;
	}
	getContent(): CardContent {
		return this.content;
	}

	serialize(): CardData {
		return {
			title: this.title.serialize().value,
			content: this.content.serialize(),
			scene: this.meta.serialize().scene,
			source: this.meta.serialize().source,
			domain: this.meta.serialize().domain,
		};
	}

	markCreated(filePath: string, notebookId: string = ""): void {
		const evt = new CardCreatedEvent(
			filePath,
			this.title.getValue(),
			this.meta.getScene(),
			notebookId,
			filePath
		);
		this.domainEvents.push(evt);
	}

	markExisted(filePath: string, notebookId: string = ""): void {
		const evt = new CardExistedEvent(
			filePath,
			this.title.getValue(),
			this.meta.getScene(),
			notebookId,
			filePath
		);
		this.domainEvents.push(evt);
	}

	pullDomainEvents(): DomainEvent[] {
		const out = this.domainEvents;
		this.domainEvents = [];
		return out;
	}
}
