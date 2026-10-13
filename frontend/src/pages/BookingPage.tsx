import { useState } from 'react'
import { Link } from 'react-router'
import { meetingTypesApi } from '../api'
import type { MeetingType, SlotsResponse } from '../generated/api'
import { useMeetingTypes } from '../useMeetingTypes'

function formatSlot(start: Date, zoneId: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: zoneId,
  }).format(start)
}

function BookingPage() {
  const { meetingTypes, state } = useMeetingTypes()
  const [selected, setSelected] = useState<MeetingType | null>(null)
  const [slots, setSlots] = useState<SlotsResponse | null>(null)
  const [slotsError, setSlotsError] = useState<string | null>(null)

  async function selectType(meetingType: MeetingType) {
    setSelected(meetingType)
    setSlots(null)
    setSlotsError(null)

    try {
      setSlots(await meetingTypesApi.meetingTypesListSlots({ meetingTypeId: meetingType.id }))
    } catch {
      setSlotsError('Не удалось загрузить свободные слоты')
    }
  }

  return (
    <main className="page">
      <h1 className="hero__title">Страница записи</h1>

      {state === 'loading' && <p className="status status--loading">Загрузка типов встреч…</p>}
      {state === 'error' && <p className="status status--down">Не удалось загрузить типы встреч</p>}
      {state === 'ready' && meetingTypes.length === 0 && (
        <p className="status status--loading">Пока нет доступных типов встреч</p>
      )}
      {state === 'ready' && meetingTypes.length > 0 && (
        <ul className="benefits">
          {meetingTypes.map((meetingType) => (
            <li key={meetingType.id} className="benefits__item">
              <button
                className="button button--secondary"
                type="button"
                onClick={() => selectType(meetingType)}
              >
                <strong>{meetingType.name}</strong> — {meetingType.durationMinutes} мин
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <section className="section" aria-labelledby="slots-title">
          <h2 id="slots-title" className="section__title">
            {selected.name}: свободные слоты
          </h2>

          {slotsError && <p className="status status--down">{slotsError}</p>}
          {!slotsError && slots && slots.slots.length === 0 && (
            <p className="status status--loading">Нет свободных слотов</p>
          )}
          {!slotsError && slots && slots.slots.length > 0 && (
            <>
              <p className="hero__subtitle">Время в поясе {slots.zoneId}</p>
              <ul className="slots">
                {slots.slots.map((slot) => (
                  <li key={slot.start.toISOString()} className="slots__item">
                    {formatSlot(slot.start, slots.zoneId)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      <Link className="button button--secondary" to="/">
        На главную
      </Link>
    </main>
  )
}

export default BookingPage
