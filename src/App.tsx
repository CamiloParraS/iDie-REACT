import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import LoginPage from './components/Auth/LoginPage'
import RegisterPage from './components/Auth/RegisterPage'
import AppointmentBooking from './components/Appointment/AppointmentBooking'
import Header from './components/Common/Header'
import Footer from './components/Common/Footer'
import ProtectedRoute from './components/Common/ProtectedRoute'
import DashboardPage from './components/Dashboard/DashboardPage'
import HistoryPage from './components/History/HistoryPage'
import { useAuth } from './hooks/useAuth'

function PublicRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

function PrivateLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/citas/nueva" element={<AppointmentBooking />} />
          <Route path="/historia" element={<HistoryPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
