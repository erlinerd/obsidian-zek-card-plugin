import type { ICardPresenterPort } from "@/domain/aggregates/card-note/ports/ICardPresenterPort";
import { injectable, inject } from "tsyringe";
import { TOKENS } from "@/infrastructure/di/Tokens";
import type { INotificationPort } from "@/domain/ports/INotificationPort";

@injectable()
export class CardPresenterAdapter implements ICardPresenterPort {
  constructor(@inject(TOKENS.INotificationPort) private readonly notify: INotificationPort) {}
  showCreated(filePath: string, existed: boolean): void {
    this.notify.info(`${existed ? "已打开现有卡片" : "卡片已创建"}: ${filePath}`);
  }
  showError(message: string): void {
    this.notify.error(`创建失败: ${message}`);
  }
}
