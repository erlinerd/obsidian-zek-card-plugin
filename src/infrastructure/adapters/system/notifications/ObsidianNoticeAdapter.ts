/**
 * Adapter: notification (Obsidian Notice)
 *
 * Responsibilities:
 * - Show transient notices for info/warn/error messages in Obsidian UI
 * - Message strings may be localized by higher layers
 */
import { injectable } from "tsyringe";
import { Notice } from "obsidian";
import type { INotificationPort } from "@/domain/ports/INotificationPort";

@injectable()
export class ObsidianNoticeAdapter implements INotificationPort {
  info(message: string): void {
    new Notice(message);
  }
  warn(message: string): void {
    new Notice(message);
  }
  error(message: string): void {
    new Notice(message);
  }
}
