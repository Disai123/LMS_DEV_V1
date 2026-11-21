import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Header from '../../components/common/Header'

const NAV = [
  { to: '/roadmap/fde', label: 'Roadmap', end: true },
  { to: '/roadmap/fde/my-learning', label: 'My Learning' },
  { to: '/roadmap/fde/capstone', label: 'Capstone Projects' },
]

export default function FdeLayout() {
  const location = useLocation()

  const isActive = (to, end) => {
    if (end) return location.pathname === to || location.pathname === `${to}/`
    return location.pathname.startsWith(to)
  }

  useEffect(() => {
    document.body.classList.add('fde-route')
    document.documentElement.classList.add('fde-route')
    return () => {
      document.body.classList.remove('fde-route')
      document.documentElement.classList.remove('fde-route')
    }
  }, [])

  const edgeX = 'px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16'

  return (
    <div className="fde-theme fde-dark min-h-screen w-full flex flex-col overflow-x-hidden" data-theme="dark">
      <Header />
      <header className={`sticky top-16 sm:top-20 z-30 border-b border-[var(--fde-bd)] bg-[var(--fde-bg)] ${edgeX} py-3`}>
        <div className="w-full flex flex-wrap items-center justify-between gap-3">
          <Link to="/roadmap/fde" className="font-display font-black text-lg text-[var(--fde-tx)] tracking-tight">
            FDE Roadmap
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
          </nav>
        </div>
        <div className="w-full mt-2">
          <Link to="/" className="text-xs text-[var(--fde-mut)] hover:text-[var(--fde-tx)]">
            ← GNANAM AI Home
          </Link>
        </div>
      </header>

      <main className={`flex-1 w-full max-w-none ${edgeX} py-6 pb-16 text-[var(--fde-tx)]`}>
        <Outlet />
      </main>

      <footer className={`border-t border-[var(--fde-bd)] py-5 text-center text-sm text-[var(--fde-mut)] bg-[var(--fde-bg)] ${edgeX}`}>
        FDE Roadmap · 12 weeks · progress saved in your browser
      </footer>
    </div>
  )
}
