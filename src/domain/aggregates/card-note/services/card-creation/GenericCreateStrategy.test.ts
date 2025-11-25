import { describe, it, expect } from 'vitest'
import { GenericCreateStrategy } from '@/domain/services/card-generation/GenericCreateStrategy'
import { CardScene } from '@/domain/aggregates/card-note/enums/CardScene'
import type { ITemplateRepository } from '@/domain/aggregates/template/ports/ITemplateRepository'
import { Template } from '@/domain/aggregates/template/Template'
import type { ICardMetaProcessorPort } from '@/domain/aggregates/card-note/ports/ICardMetaProcessorPort'
import type { ISystemClockPort } from '@/domain/ports/ISystemClockPort'

  class InMemoryTemplateRepo implements ITemplateRepository {
    async getByFileName(fileName: string): Promise<Template | null> {
    return Template.create(fileName, '内容\n{{inner}}\n- {{source}}')
    }
  }

class FixedClock implements ISystemClockPort {
  nowCompactYmdHms(): string {
    return '20250101120000'
  }
  nowIso(): string {
    return '2025-01-01T12:00:00.000Z'
  }
}


describe('GenericCreateStrategy', () => {
  it('renders content using template and builds meta with inner links', async () => {
    const repo = new InMemoryTemplateRepo()
    const meta: ICardMetaProcessorPort = {
      processMeta: () => '---\nsource:\n- [[文献A]]\n---',
      toInnerLink: (s: string) => `[[${s}]]`,
    }
    const clock = new FixedClock()
    const strategy = new GenericCreateStrategy(repo, meta, clock, CardScene.LITERATURE, { prefix: 'test_' })

    const card = await strategy.generate({
      sourceText: '选区文本',
      sourceFileName: '文献A',
    })

    expect(card.getTitle().getValue()).toBe('test_选区文本')
    const content = card.getContent().getValue()
    expect(content).toContain('---')
    expect(content).toContain('选区文本')
    expect(content).toContain('[[文献A]]')
  })
})
