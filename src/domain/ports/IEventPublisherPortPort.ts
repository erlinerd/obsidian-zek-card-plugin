import { DomainEvent } from "../events/BaseEvent";

export interface EventPublisherPort {
    publish(event: DomainEvent): Promise<void>;
    publishAll(events: DomainEvent[]): Promise<void>;
}

export interface IEventBusPort {
    emit(event: string, payload?: unknown): void;
    on(event: string, handler: (payload: unknown) => void): void;
    once(event: string, handler: (payload: unknown) => void): void;
}
