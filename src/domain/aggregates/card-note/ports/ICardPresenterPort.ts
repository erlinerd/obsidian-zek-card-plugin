export interface ICardPresenterPort {
  showCreated(filePath: string, existed: boolean): void;
  showError(message: string): void;
}
