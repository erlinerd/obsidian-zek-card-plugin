/**
 * Adapter: event bus
 *
 * Responsibilities:
 * - Bridge domain event publishing to `eventemitter2`
 * - Expose `emit`, `on`, and `once` with reasonable listener limits
 */
import EventEmitter from "eventemitter2";
import type { IEventBusPort } from "@/domain/ports/IEventPublisherPortPort";

export class EventBusAdapter implements IEventBusPort {
	private readonly emitter: EventEmitter;
	constructor() {
		this.emitter = new EventEmitter();
		this.emitter.setMaxListeners(50);
	}
	emit(event: string, payload?: unknown): void {
		this.emitter.emit(event, payload);
	}
	on(event: string, handler: (payload: unknown) => void): void {
		this.emitter.on(event, handler);
	}
	once(event: string, handler: (payload: unknown) => void): void {
		this.emitter.once(event, handler);
	}
}
