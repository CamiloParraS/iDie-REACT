import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute() {
    const { isAuthenticated, isBootstrapping } = useAuth()
    const location = useLocation()

    if (isBootstrapping) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner label="Validando sesion..." />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }

    return <Outlet />
}
