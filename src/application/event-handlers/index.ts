/**
 * Application event handlers registry
 *
 * Responsibilities:
 * - Register handlers for domain-level events on the shared event bus
 * - Compose specific handlers (created/existed) to notify UI and open files
 */
import type { IEventBusPort } from "@/domain/ports/IEventPublisherPortPort";
import { registerOnCardCreated } from "./onCardCreated";
import { registerOnCardExisted } from "./onCardExisted";

export function registerEventHandlers(bus: IEventBusPort) {
  registerOnCardCreated(bus);
  registerOnCardExisted(bus);
}
