import { Link, Outlet, useLocation } from 'react-router-dom'
import Header from '../../components/common/Header'
import { useFdeTheme } from '../hooks/useFdeTheme'

const NAV = [
  { to: '/roadmap/fde', label: 'Roadmap', end: true },
  { to: '/roadmap/fde/my-learning', label: 'My Learning' },
  { to: '/roadmap/fde/capstone', label: 'Capstone Projects' },
]

export default function FdeLayout() {
  const { theme, toggle } = useFdeTheme()
  const location = useLocation()

  const isActive = (to, end) => {
    if (end) return location.pathname === to || location.pathname === `${to}/`
    return location.pathname.startsWith(to)
  }

  return (
    <div
      className={`fde-theme min-h-screen flex flex-col ${theme === 'dark' ? 'fde-dark' : 'fde-light'}`}
      data-theme={theme}
    >
      <Header />
      <header className="sticky top-16 sm:top-20 z-30 border-b border-[var(--fde-bd)] bg-[var(--fde-bg)] px-4 py-3">
        <div className="max-w-[1100px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <Link to="/roadmap/fde" className="font-bold text-[var(--fde-tx)]">
            &gt;_ FDE Roadmap
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-[var(--fde-mut)]">
            {NAV.map(({ to, label, end }) => (
              <Link
                key={to}
                to={to}
                className={`hover:text-[var(--fde-tx)] ${
                  isActive(to, end) ? 'text-[var(--fde-tx)] font-medium' : ''
                }`}
              >
                {label}
              </Link>
            ))}
            <button
              type="button"
              onClick={toggle}
              className="text-xs border border-[var(--fde-bd)] rounded-lg px-2 py-1 hover:text-[var(--fde-tx)]"
              aria-label="Toggle light and dark theme"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </nav>
        </div>
        <div className="max-w-[1100px] mx-auto mt-2">
          <Link to="/" className="text-xs text-[var(--fde-mut)] hover:text-[var(--fde-tx)]">
            ← GNANAM AI Home
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-5 py-6 pb-16 text-[var(--fde-tx)]">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--fde-bd)] py-5 text-center text-sm text-[var(--fde-mut)] bg-[var(--fde-bg)]">
        FDE Roadmap · 12 weeks · progress saved in your browser
      </footer>
    </div>
  )
}
