import { randomUUID } from "crypto";

/** Domain event base class: all concrete events extend this */
export abstract class DomainEvent {
    public readonly id: string; // unique event id
    public readonly occurredAt: Date; // event occurrence time
    public abstract readonly type: string; // event type (e.g. "card.created")

    constructor(
        public readonly aggregateRootId: string // aggregate root id (required)
    ) {
        this.id = randomUUID();
        this.occurredAt = new Date();
    }
}
