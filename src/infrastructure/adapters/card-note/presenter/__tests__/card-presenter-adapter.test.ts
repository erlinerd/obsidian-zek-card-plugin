import { describe, it, expect, beforeEach } from 'vitest'

import { CardPresenterAdapter } from '../CardPresenterAdapter'
import type { INotificationPort } from '@/domain/ports/INotificationPort'

describe('CardPresenterAdapter', () => {
  beforeEach(() => {
    ;(globalThis as any).__notices = []
  })

  it('shows created message for new file', () => {
    const notifier: INotificationPort = {
      info: (msg) => {
        const arr = (globalThis as any).__notices || []
        arr.push(msg)
        ;(globalThis as any).__notices = arr
      },
      warn: () => {},
      error: (msg) => {
        const arr = (globalThis as any).__notices || []
        arr.push(msg)
        ;(globalThis as any).__notices = arr
      },
    }
    const presenter = new CardPresenterAdapter(notifier)
    presenter.showCreated('new.md', false)
    const notices = (globalThis as any).__notices as string[]
    expect(notices[0]).toContain('卡片已创建: new.md')
  })

  it('shows opened message for existed file', () => {
    const notifier: INotificationPort = {
      info: (msg) => {
        const arr = (globalThis as any).__notices || []
        arr.push(msg)
        ;(globalThis as any).__notices = arr
      },
      warn: () => {},
      error: (msg) => {
        const arr = (globalThis as any).__notices || []
        arr.push(msg)
        ;(globalThis as any).__notices = arr
      },
    }
    const presenter = new CardPresenterAdapter(notifier)
    presenter.showCreated('exist.md', true)
    const notices = (globalThis as any).__notices as string[]
    expect(notices[0]).toContain('已打开现有卡片: exist.md')
  })

  it('shows error message', () => {
    const notifier: INotificationPort = {
      info: (msg) => {
        const arr = (globalThis as any).__notices || []
        arr.push(msg)
        ;(globalThis as any).__notices = arr
      },
      warn: () => {},
      error: (msg) => {
        const arr = (globalThis as any).__notices || []
        arr.push(msg)
        ;(globalThis as any).__notices = arr
      },
    }
    const presenter = new CardPresenterAdapter(notifier)
    presenter.showError('错误信息')
    const notices = (globalThis as any).__notices as string[]
    expect(notices[0]).toContain('创建失败: 错误信息')
  })
})
