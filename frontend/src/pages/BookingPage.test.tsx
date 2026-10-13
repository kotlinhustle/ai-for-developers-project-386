import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { stubJsonFetch } from '../test/stubJsonFetch'
import BookingPage from './BookingPage'

const consultation = {
  id: '1',
  name: 'Консультация',
  description: 'Разбор задачи',
  durationMinutes: 30,
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

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
    stubJsonFetch([consultation])
    renderPage()

    expect(await screen.findByText('Консультация')).toBeInTheDocument()
    expect(screen.getByText(/30 мин/)).toBeInTheDocument()
  })

  it('показывает свободные слоты выбранного типа в поясе владельца', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('/slots')) {
          return jsonResponse({
            zoneId: 'Asia/Yerevan',
            slots: [{ start: '2026-10-12T06:00:00Z', durationMinutes: 30 }],
          })
        }
        return jsonResponse([consultation])
      }),
    )
    renderPage()

    await user.click(await screen.findByRole('button', { name: /Консультация/ }))

    expect(await screen.findByText(/Asia\/Yerevan/)).toBeInTheDocument()
    expect(screen.getByText(/10:00/)).toBeInTheDocument()
  })
})
