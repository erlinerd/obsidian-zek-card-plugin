/** Domain event base class: all concrete events extend this */
export abstract class DomainEvent {
    public readonly id: string; // unique event id
    public readonly occurredAt: Date; // event occurrence time
    public abstract readonly type: string; // event type (e.g. "card.created")

    constructor(
        public readonly aggregateRootId: string // aggregate root id (required)
    ) {
        const uuid = globalThis?.crypto?.randomUUID?.();
        this.id = uuid ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        this.occurredAt = new Date();
    }
}
