import { DomainError } from "@/domain/errors/DomainError";
export class CardTitle {
    private readonly value: string;

	// Title rules constants
	private static readonly MIN_LENGTH = 1; // minimum 1 char
	private static readonly MAX_LENGTH = 50; // maximum 50 chars (Obsidian filename friendly)
	// Forbidden special characters (invalid for Obsidian filenames)
	private static readonly FORBIDDEN_CHARS = /[\\/:*?"<>|]/g;

	constructor(rawTitle: string) {
		const processedTitle = rawTitle
			.trim()
			.replace(CardTitle.FORBIDDEN_CHARS, "_");

		this.validateTitle(processedTitle);

		this.value = processedTitle || "";
	}

    private validateTitle(title: string): void {
        if (title.length < CardTitle.MIN_LENGTH)
            throw new DomainError("TITLE_EMPTY", "标题不能为空");
        if (title.length > CardTitle.MAX_LENGTH)
            throw new DomainError("TITLE_TOO_LONG", "标题过长（最多50个字符）");
    }
	// Serialize for storage (consistent with other value objects)
	public serialize(): { value: string } {
		return {
			value: this.value,
		};
	}

	// Expose read-only value
	public getValue(): string {
		return this.value;
	}

	// Equality by value (value object semantics)
    public equals(other: CardTitle): boolean {
        return this.value === other.value;
    }
}
