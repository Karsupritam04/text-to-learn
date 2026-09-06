import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { isAuthenticated, signIn, demoLogin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/my-courses')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Please fill in both email and password.')
      return
    }

    setLoading(true)
    const result = signIn(email, password)
    setLoading(false)

    if (result.success) {
      navigate('/my-courses')
    } else {
      setError(result.error)
    }
  }

  const handleDemo = () => {
    setError('')
    const result = demoLogin()
    if (result.success) {
      navigate('/my-courses')
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-paper-50">
      <div className="max-w-md w-full bg-white rounded-2xl border border-ink-700/10 shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-moss-500/10 text-moss-600 mb-4 font-serif text-2xl font-bold">
            T→L
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink-950 mb-2">Welcome Back</h1>
          <p className="text-sm text-ink-700/70">
            Sign in to access your saved courses and track your learning.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Quick Demo Sign In */}
        <button
          type="button"
          onClick={handleDemo}
          className="w-full mb-6 py-3 px-4 rounded-xl bg-moss-600 hover:bg-moss-700 text-white font-medium text-sm transition-all shadow-md shadow-moss-600/20 flex items-center justify-center gap-2 focus-ring"
        >
          <span>⚡</span>
          <span>1-Click Quick Demo Sign In</span>
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-ink-700/10 w-full"></div>
          <span className="bg-white px-3 text-xs text-ink-700/50 uppercase tracking-wider font-semibold absolute">
            Or sign in with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-950 mb-1.5 uppercase tracking-wide">
              Email Address / ID
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError('')
              }}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-ink-700/20 bg-paper-50 px-4 py-2.5 text-sm text-ink-950 placeholder:text-ink-700/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-moss-500 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-ink-950 uppercase tracking-wide">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
              placeholder="••••••••"
              className="w-full rounded-xl border border-ink-700/20 bg-paper-50 px-4 py-2.5 text-sm text-ink-950 placeholder:text-ink-700/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-moss-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-ink-950 hover:bg-ink-900 text-paper-100 font-medium text-sm transition-all focus-ring disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-700/70">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-moss-600 font-semibold hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}
