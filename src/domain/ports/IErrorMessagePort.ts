export interface IErrorMessagePort {
    toMessage(error: unknown): string;
}
