// Simple DI tokens defined as unique Symbols
export const TOKENS = {
    // runtime
    Plugin: Symbol("Plugin"),
    // ports
    ILoggerPort: Symbol("ILoggerPort"),
    INotificationPort: Symbol("INotificationPort"),
    ITemplateRepository: Symbol("ITemplateRepository"),
    ICardPersistencePort: Symbol("ICardPersistencePort"),
    ICardMetaProcessorPort: Symbol("ICardMetaProcessorPort"),
    ISystemClockPort: Symbol("ISystemClockPort"),
    IErrorMessagePort: Symbol("IErrorMessagePort"),
    IEventBusPort: Symbol("IEventBusPort"),
    ICardGenerationStrategyFactory: Symbol("ICardGenerationStrategyFactory"),
    // application
    CreateCardUseCase: Symbol("CreateCardUseCase"),
    ListCardsUseCase: Symbol("ListCardsUseCase"),
    CardCreationController: Symbol("CardCreationController"),
    CardListQueryController: Symbol("CardListQueryController"),
    CardPresenter: Symbol("CardPresenter"),
} as const;
