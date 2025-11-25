import { Plugin } from "obsidian";
import { CreateCardUseCase } from "@/application/use-cases/create-card/CreateCardUseCase";
import { ListCardsUseCase } from "@/application/use-cases/ListCardsUseCase";
import { container } from "tsyringe";
import { CardRepositoryAdapter } from "@/infrastructure/adapters/card-note/persistence/CardRepositoryAdapter";
import { CardCreationController } from "@/infrastructure/controllers/CardCreationController";
import { CardListQueryController } from "@/infrastructure/controllers/CardListQueryController";
import { CardPresenterAdapter } from "@/infrastructure/adapters/card-note/presenter/CardPresenterAdapter";
import { Logger } from "@/infrastructure/adapters/system/logger/LoggerAdapter";
import { LocalTemplateRepository } from "@/infrastructure/adapters/template/persistence/TemplateRepositoryAdapter";
import { CardMetaProcessorAdapter } from "@/infrastructure/adapters/card-note/utils/CardMetaProcessorAdapter";
import { SystemClockAdapter } from "@/infrastructure/adapters/system/time/SystemClockAdapter";
import { EventBusAdapter } from "@/infrastructure/adapters/system/events/EventBusAdapter";
import { ObsidianNoticeAdapter } from "@/infrastructure/adapters/system/notifications/ObsidianNoticeAdapter";
import { TOKENS } from "./Tokens";
import { ErrorMessageAdapter } from "@/infrastructure/adapters/system/utils/ErrorMessageAdapter";
import { CardGenerationStrategyFactoryAdapter } from "@/infrastructure/adapters/card-note/services/CardGenerationStrategyFactoryAdapter";

/**
 * DI container initialization and layered registration
 *
 * Layers:
 * - Runtime: plugin instance, logging, error messages, presenter
 * - Infrastructure: adapters implementing domain ports (template repo, meta processor, system clock, card repo)
 * - Application: use cases (resolved by the container)
 * - Controllers: event handlers (coordination entry)
 *
 * Conventions:
 * - Application layer and controllers must be injected via DI
 * - Infrastructure adapters for domain ports must be registered
 * - Domain layer uses DI only for cross-aggregate services; pure business components are not registered
 * - Stateless utility classes are called directly without injection
 */

/**
 * Register runtime and base tokens
 * - Reset container and register the plugin instance
 * - Register base ports and presenter
 */
function registerRuntime(plugin?: Plugin) {
    container.reset();

    if (plugin) {
        container.register(TOKENS.Plugin, { useValue: plugin });
    } else {
        console.warn("Plugin instance not provided to initContainer");
    }
    
    // Logger port
    container.register(TOKENS.ILoggerPort, { useValue: new Logger() });

    // Error message port
    container.register(TOKENS.IErrorMessagePort, { useValue: new ErrorMessageAdapter() });


    // Notification port (Obsidian Notice adapter)
    container.register(TOKENS.INotificationPort, { useClass: ObsidianNoticeAdapter });
    // Presenter for view notifications
    container.register(TOKENS.CardPresenter, { useClass: CardPresenterAdapter });
}

/**
 * Register infrastructure adapters implementing domain ports
 * - Use `useClass` for container-managed lifecycle and injection
 */
function registerInfrastructure() {
    // Template repository adapter
    container.register(TOKENS.ITemplateRepository, { useClass: LocalTemplateRepository });

    // Card meta processor adapter
    container.register(TOKENS.ICardMetaProcessorPort, { useClass: CardMetaProcessorAdapter });

    // System clock adapter
    container.register(TOKENS.ISystemClockPort, { useClass: SystemClockAdapter });

    container.registerSingleton(TOKENS.IEventBusPort, EventBusAdapter);

    // Card persistence adapter
    container.register(TOKENS.ICardPersistencePort, { useClass: CardRepositoryAdapter });

    // Card generation strategy factory adapter
    container.register(TOKENS.ICardGenerationStrategyFactory, { useClass: CardGenerationStrategyFactoryAdapter });
}

/**
 * Register application use cases (dependencies auto-resolved)
 */
function registerApplication() {
    // Use case singleton: create card
    container.registerSingleton(TOKENS.CreateCardUseCase, CreateCardUseCase);

    // Use case singleton: list cards
    container.registerSingleton(TOKENS.ListCardsUseCase, ListCardsUseCase);
}

/**
 * Register controllers (event handlers)
 */
function registerControllers() {
    // Controller: card creation
    container.register(TOKENS.CardCreationController, { useClass: CardCreationController });
    container.register(TOKENS.CardListQueryController, { useClass: CardListQueryController });
}

/**
 * Container entry: initialize in layer order
 * - Order: Runtime -> Infrastructure -> Application -> Controllers
 */
export function initContainer(plugin?: Plugin) {
    registerRuntime(plugin);
    registerInfrastructure();
    registerApplication();
    registerControllers();
}

export { container };
