import { useEffect, useState } from 'react'
import './App.css'

type HealthState = 'loading' | 'up' | 'down'

const STATUS_LABEL: Record<HealthState, string> = {
  loading: 'Проверка доступности бэкенда...',
  up: 'Бэкенд доступен',
  down: 'Бэкенд недоступен',
}

function App() {
  const [health, setHealth] = useState<HealthState>('loading')

  useEffect(() => {
    let active = true

    fetch('/api/actuator/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        return response.json() as Promise<{ status?: string }>
      })
      .then((data) => {
        if (active) {
          setHealth(data.status === 'UP' ? 'up' : 'down')
        }
      })
      .catch(() => {
        if (active) {
          setHealth('down')
        }
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="app">
      <h1>Календарь звонков</h1>
      <p>Учебный каркас: React + TypeScript + Vite</p>
      <p className={`status status--${health}`}>{STATUS_LABEL[health]}</p>
    </main>
  )
}

export default App
