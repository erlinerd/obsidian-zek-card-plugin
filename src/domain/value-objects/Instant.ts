import { DomainError } from "@/domain/errors/DomainError";

export class Instant {
  private readonly iso: string;
  constructor(iso: string) {
    const s = (iso || "").trim();
    if (!Instant.isIsoWithMsAndTz(s)) throw new DomainError("INVALID_ISO_TIME", "时间格式必须包含毫秒与时区");
    const d = new Date(s);
    if (isNaN(d.getTime())) throw new DomainError("INVALID_ISO_TIME", "时间格式不合法");
    this.iso = new Date(d.toISOString()).toISOString();
  }
  static isIsoWithMsAndTz(s: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(?:Z|[+-]\d{2}:\d{2})$/.test(s);
  }
  toIso(): string {
    return this.iso;
  }
  equals(other: Instant): boolean {
    return this.iso === other.iso;
  }
}
