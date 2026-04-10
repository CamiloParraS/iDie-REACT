import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { APP_NAME } from '../../utils/constants'
import { useAuth } from '../../hooks/useAuth'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
        'idie-nav-link',
        isActive
            ? 'idie-nav-link-active'
            : 'idie-nav-link-inactive',
    ].join(' ')

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')

    const handleLogout = async () => {
        await logout()
        navigate('/login', { replace: true })
    }

    return (
        <header className="border-b border-blue-200 bg-white/90 backdrop-blur-sm">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                        Plataforma Clinica
                    </p>
                    <h1 className="text-2xl font-bold text-blue-900">{APP_NAME}</h1>
                </div>

                <button
                    type="button"
                    className="idie-btn-secondary text-sm sm:hidden"
                    onClick={() => setMenuOpen((prev) => !prev)}
                >
                    Menu
                </button>

                <div className="hidden items-center gap-4 sm:flex">
                    <p className="text-sm text-slate-700">{fullName || user?.username}</p>
                    <button
                        type="button"
                        className="idie-btn-primary text-sm"
                        onClick={handleLogout}
                    >
                        Cerrar sesion
                    </button>
                </div>
            </div>

            <div
                className={[
                    'border-t border-blue-100 bg-white sm:hidden',
                    menuOpen ? 'block' : 'hidden',
                ].join(' ')}
            >
                <nav className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-3">
                    <NavLink className={navLinkClass} to="/dashboard" onClick={() => setMenuOpen(false)}>
                        Dashboard
                    </NavLink>
                    <NavLink className={navLinkClass} to="/citas/nueva" onClick={() => setMenuOpen(false)}>
                        Agendar cita
                    </NavLink>
                    <NavLink className={navLinkClass} to="/historia" onClick={() => setMenuOpen(false)}>
                        Historia clinica
                    </NavLink>
                    <button
                        type="button"
                        className="idie-btn-primary text-sm"
                        onClick={handleLogout}
                    >
                        Cerrar sesion
                    </button>
                </nav>
            </div>

            <nav className="mx-auto hidden w-full max-w-7xl gap-2 px-4 pb-3 sm:flex sm:px-6 lg:px-8">
                <NavLink className={navLinkClass} to="/dashboard">
                    Dashboard
                </NavLink>
                <NavLink className={navLinkClass} to="/citas/nueva">
                    Agendar cita
                </NavLink>
                <NavLink className={navLinkClass} to="/historia">
                    Historia clinica
                </NavLink>
            </nav>
        </header>
    )
}
