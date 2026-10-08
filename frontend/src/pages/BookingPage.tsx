import { Link } from 'react-router'

function BookingPage() {
  return (
    <main className="page page--narrow">
      <h1 className="hero__title">Страница записи</h1>
      <p className="hero__subtitle">Скоро появится</p>
      <Link className="button button--secondary" to="/">
        На главную
      </Link>
    </main>
  )
}

export default BookingPage
