import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import OwnerPage from './OwnerPage'

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
      <OwnerPage />
    </MemoryRouter>,
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('страница владельца', () => {
  it('показывает существующие типы встреч', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse([consultation])),
    )
    renderPage()

    expect(await screen.findByText('Консультация')).toBeInTheDocument()
  })

  it('создаёт тип встречи и показывает его в списке', async () => {
    const user = userEvent.setup()
    let created = false

    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init?: RequestInit) => {
        if (init?.method === 'POST') {
          created = true
          return jsonResponse(consultation, 201)
        }
        return jsonResponse(created ? [consultation] : [])
      }),
    )
    renderPage()

    await user.type(screen.getByLabelText('Название'), 'Консультация')
    await user.click(screen.getByRole('button', { name: 'Создать тип встречи' }))

    expect(await screen.findByText('Консультация')).toBeInTheDocument()
  })
})
