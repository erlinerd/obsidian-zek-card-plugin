/**
 * Application bootstrap
 *
 * Responsibilities:
 * - Initialize DI container with runtime/infrastructure/application/controllers
 * - Resolve event bus and register application-level event handlers
 * - Provide a single entry for plugin startup wiring
 */
import { Plugin } from "obsidian";
import { initContainer } from "@/infrastructure/di/Container";
import { container } from "tsyringe";
import { TOKENS } from "@/infrastructure/di/Tokens";
import type { IEventBusPort } from "@/domain/ports/IEventPublisherPortPort";
import { registerEventHandlers } from "@/application/event-handlers";

export function bootstrap(plugin?: Plugin) {
	initContainer(plugin);
	const bus = container.resolve<IEventBusPort>(TOKENS.IEventBusPort);
	registerEventHandlers(bus);
}
