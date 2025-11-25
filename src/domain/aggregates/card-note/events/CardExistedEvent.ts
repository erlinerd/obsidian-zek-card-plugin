import { DomainEvent } from "@/domain/events/BaseEvent";
import { CardEventTypes } from "./EventTypes";
import { CardScene } from "../enums/CardScene";

export class CardExistedEvent extends DomainEvent {
    public readonly type = CardEventTypes.CARD_EXISTED;

    constructor(
        aggregateRootId: string,
        public readonly title: string,
        public readonly scene: CardScene,
        public readonly notebookId: string,
        public readonly filePath: string
    ) {
        super(aggregateRootId);
    }
}
