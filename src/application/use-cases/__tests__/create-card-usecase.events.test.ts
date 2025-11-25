import { describe, it, expect, vi } from "vitest";
import { CreateCardUseCase } from "@/application/use-cases/create-card/CreateCardUseCase";
import type { ICardPersistencePort } from "@/domain/aggregates/card-note/ports/ICardPersistencePort";
import type { ICardGenerationStrategyFactory } from "@/domain/aggregates/card-note/ports/ICardGenerationStrategyFactory";
import { CardScene } from "@/domain/aggregates/card-note/enums/CardScene";

describe("CreateCardUseCase domain events", () => {
  const repo: ICardPersistencePort = {
    exists: vi.fn(async (path: string) => path.includes("exists")),
    saveCard: vi.fn(async () => ({ path: "new-card.md" })),
  } as any;

  const factory: ICardGenerationStrategyFactory = {
    get: vi.fn(() => ({
      generate: vi.fn(async () => ({
        toData: () => ({ title: "new-card", meta: { type: "idea", scene: CardScene.IDEA, domain: [], source: [], created: new Date().toISOString() } })
      })) as any,
    })),
  } as any;

  it("emits card.created for new card", async () => {
    const bus = { emit: vi.fn(), on: vi.fn(), once: vi.fn() };
    const useCase = new CreateCardUseCase(repo, factory, bus as any);
    const res = await useCase.execute({ sourceFileName: "a.md", sourceText: "" } as any, CardScene.IDEA);
    expect(res.existed).toBe(false);
    expect(bus.emit).toHaveBeenCalledWith("card.created", expect.objectContaining({ filePath: "new-card.md" }));
  });

  it("emits card.existed for existing card", async () => {
    const bus = { emit: vi.fn(), on: vi.fn(), once: vi.fn() };
    const useCase = new CreateCardUseCase({
      exists: vi.fn(async () => true),
      saveCard: vi.fn(async () => ({ path: "exists-card.md" })),
    } as any, factory, bus as any);
    const res = await useCase.execute({ sourceFileName: "exists.md", sourceText: "" } as any, CardScene.IDEA);
    expect(res.existed).toBe(true);
    expect(bus.emit).toHaveBeenCalledWith("card.existed", expect.objectContaining({ filePath: "new-card.md" }));
  });
});
