export interface INotificationPort {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}
