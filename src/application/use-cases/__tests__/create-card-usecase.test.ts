import { describe, it, expect, vi } from 'vitest'
import { CreateCardUseCase } from '../create-card/CreateCardUseCase'
import { CardScene } from '@/domain/aggregates/card-note/enums/CardScene'
import type { ITemplateRepository } from '@/domain/aggregates/template/ports/ITemplateRepository'
import type { ICardMetaProcessorPort } from '@/domain/aggregates/card-note/ports/ICardMetaProcessorPort'
import type { ISystemClockPort } from '@/domain/ports/ISystemClockPort'
import { GenericCreateStrategy } from '@/domain/services/card-generation/GenericCreateStrategy'
import type { ICardGenerationStrategyFactory } from '@/domain/aggregates/card-note/ports/ICardGenerationStrategyFactory'

function makeRepo(exists: boolean) {
  return {
    saveCard: vi.fn(async ({ title }) => ({ path: `${title}.md` })),
    exists: vi.fn(async (path: string) => exists),
    open: vi.fn(async () => {}),
    read: vi.fn(async () => ''),
    write: vi.fn(async () => {}),
  }
}

describe('CreateCardUseCase existence behavior', () => {
  it('returns existed=true and does not save when file exists', async () => {
    const repo = makeRepo(true)
    ;(repo.exists as any) = vi.fn(async (path: string) => path === '💡idea_text.md')
    const templateRepo: ITemplateRepository = { getByFileName: async () => null }
    const meta: ICardMetaProcessorPort = { processMeta: () => '---\n', toInnerLink: (s: string) => `[[${s}]]` }
    const clock: ISystemClockPort = { nowCompactYmdHms: () => '20250101_000000', nowIso: () => '2025-01-01T00:00:00.000Z' }
    const factory: ICardGenerationStrategyFactory = {
      get: (scene) => new GenericCreateStrategy(
        templateRepo,
        meta,
        clock,
        scene,
        { prefix: scene === CardScene.IDEA ? '💡idea_' : scene === CardScene.LITERATURE ? '📖literature_' : scene === CardScene.TOPIC ? '🎯topic_' : '' }
      )
    }
    const usecase = new CreateCardUseCase(repo as any, factory)

    const result = await usecase.execute({ sourceFileName: 'src.md', sourceText: 'text' }, CardScene.IDEA)
    expect(result.existed).toBe(true)
    expect(repo.saveCard).not.toHaveBeenCalled()
    expect(result.filePath).toBe('💡idea_text.md')
  })

  it('creates when not exists and returns existed=false', async () => {
    const repo = makeRepo(false)
    const templateRepo: ITemplateRepository = { getByFileName: async () => null }
    const meta: ICardMetaProcessorPort = { processMeta: () => '---\n', toInnerLink: (s: string) => `[[${s}]]` }
    const clock: ISystemClockPort = { nowCompactYmdHms: () => '20250101_000000', nowIso: () => '2025-01-01T00:00:00.000Z' }
    const factory: ICardGenerationStrategyFactory = {
      get: (scene) => new GenericCreateStrategy(
        templateRepo,
        meta,
        clock,
        scene,
        { prefix: scene === CardScene.IDEA ? '💡idea_' : scene === CardScene.LITERATURE ? '📖literature_' : scene === CardScene.TOPIC ? '🎯topic_' : '' }
      )
    }
    const usecase = new CreateCardUseCase(repo as any, factory)

    const result = await usecase.execute({ sourceFileName: 'src.md', sourceText: 'text' }, CardScene.IDEA)
    expect(result.existed).toBe(false)
    expect(repo.saveCard).toHaveBeenCalledTimes(1)
    expect(result.filePath).toBe('💡idea_text.md')
  })

  // existed=true case covered above
})
