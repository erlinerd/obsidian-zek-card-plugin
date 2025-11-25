export class Template {
	public readonly id: string;
	public readonly content: string;

	private constructor(id: string, content: string) {
		this.id = id;
		this.content = this.validateContent(content);
	}

	static create(id: string, content: string): Template {
		return new Template(id, content);
	}

    private validateContent(content: string): string {
        const trimmed = content.trim();
        if (!trimmed) throw new Error("模板内容不能为空");
        return trimmed;
    }

	public render(replaceData: Record<string, string>): string {
		return this.content.replace(/\{\{([^}|]+)(?:\|([^}]*))?\}\}/g, (_m, key: string, def: string | undefined) => {
			const k = String(key).trim();
			if (Object.prototype.hasOwnProperty.call(replaceData, k)) {
				const v = replaceData[k];
				return v == null ? "" : String(v);
			}
			return def == null ? "" : String(def);
		});
	}

	public toJson(): { id: string; content: string } {
		return { id: this.id, content: this.content };
	}
}
