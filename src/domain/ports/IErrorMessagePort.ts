import { DomainError } from "@/domain/errors/DomainError";

export interface IErrorMessagePort {
    toMessage(error: unknown): string;
}
