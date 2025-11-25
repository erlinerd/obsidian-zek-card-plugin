import { describe, it, expect } from "vitest";
import { Instant } from "@/domain/value-objects/Instant";

describe("Instant", () => {
  it("accepts iso with ms and tz and returns same iso", () => {
    const iso = "2025-01-01T12:34:56.789Z";
    const ins = new Instant(iso);
    expect(ins.toIso()).toBe(iso);
  });
  it("throws on invalid iso (missing milliseconds)", () => {
    expect(() => new Instant("2025-01-01T12:34:56Z")).toThrow();
  });
});
