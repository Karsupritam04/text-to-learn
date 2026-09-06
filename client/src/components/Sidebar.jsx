import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Sidebar() {
  const { isAuthenticated, user, loginWithRedirect, logout, configured } = useAuth()

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-ink-950 text-paper-100 h-screen sticky top-0 px-5 py-6">
      <NavLink to="/" className="flex items-center gap-2 mb-8">
        <span className="text-moss-400 font-serif text-2xl">T→L</span>
        <span className="font-serif text-lg tracking-tight">Text to Learn</span>
      </NavLink>

      <nav className="flex flex-col gap-1 text-sm">
        <SidebarLink to="/">All courses</SidebarLink>
        <SidebarLink to="/my-courses">My courses</SidebarLink>
      </nav>

      <div className="mt-auto pt-6 border-t border-ink-800 text-sm">
        {isAuthenticated ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-moss-500/20 text-moss-400 font-semibold flex items-center justify-center text-sm border border-moss-500/30 shrink-0">
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-paper-100 truncate">{user?.name || 'Learner'}</p>
                <p className="text-[11px] text-paper-100/60 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="w-full text-xs text-clay-400 hover:text-clay-300 transition-colors py-1.5 rounded-lg bg-ink-900 border border-ink-800 text-center font-medium focus-ring"
            >
              Sign out
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="w-full block text-center rounded-xl bg-moss-600 hover:bg-moss-700 transition-colors py-2.5 font-medium text-sm text-white shadow-sm focus-ring"
          >
            Sign in
          </NavLink>
        )}
      </div>
    </aside>
  )
}

function SidebarLink({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `rounded-md px-3 py-2 transition-colors focus-ring ${
          isActive ? 'bg-ink-800 text-paper-100' : 'text-paper-100/70 hover:bg-ink-900 hover:text-paper-100'
        }`
      }
    >
      {children}
    </NavLink>
  )
}
