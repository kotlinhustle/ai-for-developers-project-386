import { Link } from 'react-router'
import { useMeetingTypes } from '../useMeetingTypes'

function BookingPage() {
  const { meetingTypes, state } = useMeetingTypes()

  return (
    <main className="page page--narrow">
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
              <strong>{meetingType.name}</strong> — {meetingType.durationMinutes} мин
            </li>
          ))}
        </ul>
      )}

      <Link className="button button--secondary" to="/">
        На главную
      </Link>
    </main>
  )
}

export default BookingPage
