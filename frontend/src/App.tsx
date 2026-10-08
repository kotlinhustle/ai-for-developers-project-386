import { Route, Routes } from 'react-router'
import BookingPage from './pages/BookingPage'
import HomePage from './pages/HomePage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/booking" element={<BookingPage />} />
    </Routes>
  )
}

export default App
