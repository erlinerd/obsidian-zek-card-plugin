import { describe, it, expect } from "vitest";
import { CardMeta } from "@/domain/aggregates/card-note/value-objects/CardMeta";
import { DomainError } from "@/domain/errors/DomainError";

describe("CardMeta", () => {
  it("throws when domain has empty string", () => {
    expect(() => new CardMeta("idea" as any, [""], ["src"]))
      .toThrowError(DomainError);
  });

  it("throws when source has empty string", () => {
    expect(() => new CardMeta("idea" as any, ["domain"], [""]))
      .toThrowError(DomainError);
  });

  it("throws on invalid scene", () => {
    expect(() => new CardMeta("invalid" as any, [], []))
      .toThrowError(DomainError);
  });

  it("created ISO includes milliseconds", () => {
    const iso = "2025-01-01T12:34:56.789Z";
    const meta = new CardMeta("idea" as any, [], [], iso);
    expect(meta.serialize().created).toBe(iso);
  });
});
