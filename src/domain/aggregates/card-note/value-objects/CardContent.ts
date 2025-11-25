import { DomainError } from "@/domain/errors/DomainError";

export class CardContent {
    private readonly value: string;

    constructor(rawContent: string) {
        const processedContent = rawContent.trim();
        this.validateContent(processedContent);
        this.value = processedContent || "";
    }

    private validateContent(content: string): void {
        if (!content) {
            throw new DomainError("CONTENT_EMPTY", "内容不能为空");
        }
    }

    public getWordCount(includeSpace = true): number {
        return includeSpace
            ? this.value.length
            : this.value.replace(/\s+/g, "").length;
    }

    public serialize(): string {
        return this.value;
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: CardContent): boolean {
        return this.value === other.value;
    }
}
