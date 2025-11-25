import { describe, it, expect } from 'vitest'
import { CardCreationController } from '../CardCreationController'
import type { ILoggerPort } from '@/domain/ports/ILoggerPort'
import type { IErrorMessagePort } from '@/domain/ports/IErrorMessagePort'
import type { ICardPersistencePort } from '@/domain/aggregates/card-note/ports/ICardPersistencePort'
import type { ICardPresenterPort } from '@/domain/aggregates/card-note/ports/ICardPresenterPort'
import { CardScene } from '@/domain/aggregates/card-note/enums/CardScene'

class NoopLogger implements ILoggerPort {
  debug(): void {}
  info(): void {}
  warn(): void {}
  error(): void {}
}

class ErrorMessage implements IErrorMessagePort {
  toMessage(error: unknown): string {
    return (error as Error)?.message ?? String(error)
  }
}

describe('CardCreationController integration (Presenter + Repo)', () => {
  it('calls presenter and opens file when created (existed=false)', async () => {
    const opened: string[] = []
    const notices: string[] = []

    const presenter: ICardPresenterPort = {
      showCreated: (fp, existed) => notices.push(`${existed ? '已打开现有卡片' : '卡片已创建'}: ${fp}`),
      showError: (msg) => notices.push(`创建失败: ${msg}`),
    }

    const repo: ICardPersistencePort = {
      exists: async () => false,
      saveCard: async () => ({ path: 'foo.md' }),
      open: async (fp) => { opened.push(fp) },
      listAllCards: async () => [],
    }

    const useCase = { execute: async () => ({ title: 'foo', content: 'bar', scene: CardScene.IDEA, source: [], domain: [], filePath: 'foo.md', existed: false }) } as unknown as any

    const ctrl = new CardCreationController(useCase, new NoopLogger(), new ErrorMessage(), repo, presenter)
    await ctrl.createIdeaCard({ sourceFileName: 'note', sourceText: 'content' })

    expect(notices[0]).toContain('卡片已创建: foo.md')
    expect(opened[0]).toBe('foo.md')
  })

  it('calls presenter and opens file when existed=true', async () => {
    const opened: string[] = []
    const notices: string[] = []

    const presenter: ICardPresenterPort = {
      showCreated: (fp, existed) => notices.push(`${existed ? '已打开现有卡片' : '卡片已创建'}: ${fp}`),
      showError: (msg) => notices.push(`创建失败: ${msg}`),
    }

    const repo: ICardPersistencePort = {
      exists: async () => true,
      saveCard: async () => ({ path: 'foo.md' }),
      open: async (fp) => { opened.push(fp) },
      listAllCards: async () => [],
    }

    const useCase = { execute: async () => ({ title: 'foo', content: 'bar', scene: CardScene.IDEA, source: [], domain: [], filePath: 'foo.md', existed: true }) } as unknown as any

    const ctrl = new CardCreationController(useCase, new NoopLogger(), new ErrorMessage(), repo, presenter)
    await ctrl.createIdeaCard({ sourceFileName: 'note', sourceText: 'content' })

    expect(notices[0]).toContain('已打开现有卡片: foo.md')
    expect(opened[0]).toBe('foo.md')
  })

  it('calls presenter.showError on failure', async () => {
    const notices: string[] = []

    const presenter: ICardPresenterPort = {
      showCreated: () => {},
      showError: (msg) => notices.push(`创建失败: ${msg}`),
    }

    const repo: ICardPersistencePort = {
      exists: async () => false,
      saveCard: async () => ({ path: 'foo.md' }),
      open: async () => {},
      listAllCards: async () => [],
    }

    const useCase = { execute: async () => { throw new Error('boom') } } as unknown as any

    const ctrl = new CardCreationController(useCase, new NoopLogger(), new ErrorMessage(), repo, presenter)
    await expect(() => ctrl.createIdeaCard({ sourceFileName: 'note', sourceText: 'content' })).rejects.toThrow()
    expect(notices[0]).toContain('创建失败: boom')
  })
})
