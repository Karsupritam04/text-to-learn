import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, Link } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import MyCourses from './pages/MyCourses'
import Course from './pages/Course'
import Lesson from './pages/Lesson'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { useAuth } from './hooks/useAuth'
import { setAuthTokenGetter } from './utils/api'

export default function App() {
  const { getAccessTokenSilently, configured, isAuthenticated, user, loginWithRedirect, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Milestone 4: Auth0 token attachment
  useEffect(() => {
    if (configured && getAccessTokenSilently) {
      setAuthTokenGetter(getAccessTokenSilently)
    }
  }, [configured, getAccessTokenSilently])

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-paper-50 font-sans text-ink-950">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 bg-ink-950 text-paper-100 sticky top-0 z-50 shadow-md">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-moss-400 font-serif text-xl font-bold">T→L</span>
          <span className="font-serif text-base font-semibold tracking-tight">Text to Learn</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded-md text-paper-100 hover:bg-ink-900 focus-ring"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ink-900 text-paper-100 px-5 py-4 flex flex-col gap-3 border-b border-ink-800">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `text-sm font-medium py-1.5 ${isActive ? 'text-moss-400 font-bold' : 'text-paper-100/80'}`
            }
          >
            All Courses
          </NavLink>
          <NavLink
            to="/my-courses"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `text-sm font-medium py-1.5 ${isActive ? 'text-moss-400 font-bold' : 'text-paper-100/80'}`
            }
          >
            My Saved Courses
          </NavLink>
          <div className="pt-3 border-t border-ink-800 flex items-center justify-between text-xs">
            {isAuthenticated ? (
              <>
                <span className="truncate max-w-[180px] text-paper-100">{user?.name || user?.email}</span>
                <button
                  onClick={() => logout()}
                  className="text-clay-400 hover:text-clay-300 font-medium py-1 px-2 rounded bg-ink-800"
                >
                  Log out
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-lg bg-moss-600 hover:bg-moss-700 py-2 font-semibold text-white transition-colors"
              >
                Sign in
              </NavLink>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/course/:courseId" element={<Course />} />
          <Route path="/lesson/:lessonId" element={<Lesson />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
      <span className="text-5xl">🧭</span>
      <h1 className="font-serif text-3xl font-bold mt-4 mb-2">Page Not Found</h1>
      <p className="text-ink-700/70 text-sm mb-6">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="inline-block rounded-xl bg-moss-600 hover:bg-moss-700 text-white font-semibold px-6 py-2.5 text-sm transition-all focus-ring"
      >
        &larr; Return to Home
      </Link>
    </div>
  )
}
