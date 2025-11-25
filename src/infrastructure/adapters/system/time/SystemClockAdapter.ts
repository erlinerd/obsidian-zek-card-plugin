/**
 * Adapter: system clock
 *
 * Responsibilities:
 * - Provide compact datetime (`YYYYMMDDHHmmss`) for filenames
 * - Provide ISO timestamp suitable for frontmatter
 */
import type { ISystemClockPort } from "@/domain/ports/ISystemClockPort";
import { injectable } from "tsyringe";
import dayjs from "dayjs";

@injectable()
export class SystemClockAdapter implements ISystemClockPort {
    nowCompactYmdHms(): string {
        return dayjs(Date.now()).format("YYYYMMDDHHmmss");
    }
    nowIso(): string {
        return new Date(Date.now()).toISOString();
    }
}
