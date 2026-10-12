import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { stubJsonFetch } from '../test/stubJsonFetch'
import BookingPage from './BookingPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <BookingPage />
    </MemoryRouter>,
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('страница записи', () => {
  it('показывает пустое состояние, когда типов встреч нет', async () => {
    stubJsonFetch([])
    renderPage()

    expect(await screen.findByText('Пока нет доступных типов встреч')).toBeInTheDocument()
  })

  it('показывает типы встреч, разобранные сгенерированным клиентом', async () => {
    stubJsonFetch([
      { id: '1', name: 'Консультация', description: 'Разбор задачи', durationMinutes: 30 },
    ])
    renderPage()

    expect(await screen.findByText('Консультация')).toBeInTheDocument()
    expect(screen.getByText(/30 мин/)).toBeInTheDocument()
  })
})
