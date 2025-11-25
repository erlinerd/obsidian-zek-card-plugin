import { DomainError } from "@/domain/errors/DomainError";
import type { IErrorMessagePort } from "@/domain/ports/IErrorMessagePort";

export class ErrorMessageAdapter implements IErrorMessagePort {
    toMessage(error: unknown): string {
        const d = "发生未知错误";
        if (error instanceof DomainError) {
            const m: Record<string, string> = {
                TITLE_EMPTY: "标题不能为空",
                TITLE_TOO_LONG: "标题过长（最多50个字符）",
                DOMAIN_NOT_ARRAY: "领域必须是字符串数组",
                DOMAIN_EMPTY: "领域不能为空",
                SOURCE_NOT_ARRAY: "来源必须是字符串数组",
                SOURCE_EMPTY: "来源不能为空",
                INVALID_SCENE: "不合法的卡片类型",
                UNSUPPORTED_CARD_SCENE: "不支持的卡片类型",
                INVALID_SOURCE_FILE_NAME: "sourceFileName不能为空",
                INVALID_ISO_TIME: "时间格式必须为包含毫秒与时区的ISO字符串",
            };
            return m[error.code] || error.message || d;
        }
        if (error instanceof Error) return error.message || d;
        return d;
    }
}
