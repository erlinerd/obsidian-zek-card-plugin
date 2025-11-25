/**
 * Controller: card creation
 *
 * Responsibilities:
 * - Validate incoming request and delegate to `CreateCardUseCase`
 * - Log lifecycle events and route errors to `IErrorMessagePort`
 * - Present errors to UI via `ICardPresenterPort`
 * - Success notifications and file opening are handled by event handlers
 */
import { inject, injectable } from "tsyringe";
import type { ILoggerPort } from "@/domain/ports/ILoggerPort";
import { TOKENS } from "@/infrastructure/di/Tokens";
import { CardScene } from "@/domain/aggregates/card-note/enums/CardScene";
import { CreateCardUseCase } from "@/application/use-cases/create-card/CreateCardUseCase";
import { validateCreateCardRequest } from "@/application/use-cases/create-card/CreateCardRequestValidator";
import type { IErrorMessagePort } from "@/domain/ports/IErrorMessagePort";
import type { ICardPersistencePort } from "@/domain/aggregates/card-note/ports/ICardPersistencePort";
import type { ICardPresenterPort } from "@/domain/aggregates/card-note/ports/ICardPresenterPort";

// Parameters accepted by the controller methods
export interface ControllerCreateCardParams {
	sourceText: string;
	sourceFileName: string;
}

@injectable()
export class CardCreationController {
    constructor(
        @inject(TOKENS.CreateCardUseCase)
        private createCardUseCase: CreateCardUseCase,
        @inject(TOKENS.ILoggerPort) private readonly logger: ILoggerPort,
        @inject(TOKENS.IErrorMessagePort) private readonly errorMessage: IErrorMessagePort,
        @inject(TOKENS.ICardPersistencePort) private readonly cardRepository: ICardPersistencePort,
        @inject(TOKENS.CardPresenter) private readonly presenter: ICardPresenterPort
    ) {}

    
    async createIdeaCard(params: ControllerCreateCardParams): Promise<void> {
        await this.createCardWithScene(CardScene.IDEA, params);
    }
    async createLiteratureCard(params: ControllerCreateCardParams): Promise<void> {
        await this.createCardWithScene(CardScene.LITERATURE, params);
    }
    async createTopicCard(params: ControllerCreateCardParams): Promise<void> {
        await this.createCardWithScene(CardScene.TOPIC, params);
    }

    private async createCardWithScene(scene: CardScene, params: ControllerCreateCardParams): Promise<void> {
        try {
            const dto = validateCreateCardRequest({
                sourceFileName: params.sourceFileName,
                sourceText: params.sourceText,
                scene,
            });
            const result = await this.createCardUseCase.execute({
                sourceFileName: dto.sourceFileName,
                sourceText: dto.sourceText,
            }, scene);
            this.logger.info("Card created", result);
            // Notification and file opening are handled by event handlers
        } catch (error) {
            this.logger.error("Card creation failed", error as Error);
            const msg = this.errorMessage.toMessage(error);
            this.presenter.showError(msg);
            throw error;
        }
    }
}
