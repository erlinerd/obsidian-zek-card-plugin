import { DomainError } from "@/domain/errors/DomainError";
import { CardScene } from "@/domain/aggregates/card-note/enums/CardScene";
import { Instant } from "@/domain/value-objects/Instant";

export class CardMeta {
	setScene(newScene: CardScene) {
        return new CardMeta(
            newScene,
            Array.from(this.domain),
            Array.from(this.source),
            this.created.toIso(),
            this.type
        );
	}
	getScene(): CardScene {
		return this.scene;
	}
	private readonly scene: CardScene;
	private readonly domain: Set<string>;
	private readonly source: Set<string>;
    private readonly created: Instant;
	private readonly type: string;

	constructor(
		scene: CardScene,
		domain: string[],
		source: string[],
		created?: string,
		type: string = "card"
	) {
		this.scene = this.validateScene(scene);
		this.domain = this.validateAndConvertDomain(domain);
		this.source = this.validateAndConvertSource(source);
        this.created = new Instant(created?.trim() || new Date().toISOString());
		this.type = type?.trim() || "card";
	}

    private validateAndConvertDomain(domainArray: string[]): Set<string> {
        if (!Array.isArray(domainArray)) {
            throw new DomainError("DOMAIN_NOT_ARRAY", "domain 必须是字符串数组");
        }

		const validatedSet = new Set<string>();
		for (const domain of domainArray) {
			const validated = this.validateSingleDomain(domain);
			validatedSet.add(validated); // Set 自动去重
		}
		return validatedSet;
	}
    // Validate a single domain (non-empty)
    private validateSingleDomain(domain: string): string {
        const trimmedDomain = domain.trim();
        if (!trimmedDomain) {
            throw new DomainError("DOMAIN_EMPTY", "domain 不能为空字符串");
        }

		return trimmedDomain;
	}

    private validateAndConvertSource(sourceArray: string[]): Set<string> {
        if (!Array.isArray(sourceArray)) {
            throw new DomainError("SOURCE_NOT_ARRAY", "source 必须是字符串数组");
        }

		const validatedSet = new Set<string>();
		for (const source of sourceArray) {
			const validated = this.validateSingleSource(source);
			validatedSet.add(validated); // Set 自动去重
		}
		return validatedSet;
	}
    // Validate a single source (non-empty)
    private validateSingleSource(source: string): string {
        const trimmedSource = source.trim();
        if (!trimmedSource) {
            throw new DomainError("SOURCE_EMPTY", "source 不能为空字符串");
        }

		return trimmedSource;
	}

    // Expose domain as array copy (avoid external mutation)
	public getDomain(): string[] {
		return Array.from(this.domain);
	}
    // Expose source as array copy (avoid external mutation)
	public getSource(): string[] {
		return Array.from(this.source);
	}
    /** Check if card has specified source */
	public hasSource(targetSource: string): boolean {
		return this.source.has(targetSource.trim());
	}

    /** Check if card has specified domain */
	public hasDomain(targetDomain: string): boolean {
		return this.domain.has(targetDomain.trim());
	}

    private validateScene(scene: CardScene): CardScene {
        const validScenes: CardScene[] = Object.values(CardScene);
        if (!validScenes.includes(scene)) {
            throw new DomainError("INVALID_SCENE", `不合法的场景值：${scene}，仅支持 ${validScenes.join("/")}`);
        }
        return scene;
    }

    /** Serialize to plain object */
	public serialize() {
        return {
            type: this.type,
            scene: this.scene,
            domain: Array.from(this.domain),
            source: Array.from(this.source),
            created: this.created.toIso(),
        };
	}
}
