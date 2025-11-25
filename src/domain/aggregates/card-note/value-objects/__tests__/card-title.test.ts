import { describe, it, expect } from "vitest";
import { CardTitle } from "@/domain/aggregates/card-note/value-objects/CardTitle";
import { DomainError } from "@/domain/errors/DomainError";

describe("CardTitle", () => {
  it("replaces forbidden chars", () => {
    const t = new CardTitle("a:b*c?");
    expect(t.getValue()).toBe("a_b_c_");
  });

  it("throws on empty title", () => {
    expect(() => new CardTitle(" ")).toThrowError(DomainError);
  });

  it("throws on too long title", () => {
    const long = "x".repeat(51);
    expect(() => new CardTitle(long)).toThrowError(DomainError);
  });
});
