import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Signup() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/my-courses')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    const displayName = name.trim() || email.split('@')[0]
    login({ name: displayName, email })
    navigate('/my-courses')
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-paper-50">
      <div className="max-w-md w-full bg-white rounded-2xl border border-ink-700/10 shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-moss-500/10 text-moss-600 mb-4 font-serif text-2xl font-bold">
            T→L
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink-950 mb-2">Create Account</h1>
          <p className="text-sm text-ink-700/70">
            Start generating and saving personalized AI courses today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-950 mb-1.5 uppercase tracking-wide">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Developer"
              className="w-full rounded-xl border border-ink-700/20 bg-paper-50 px-4 py-2.5 text-sm text-ink-950 placeholder:text-ink-700/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-moss-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-950 mb-1.5 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-ink-700/20 bg-paper-50 px-4 py-2.5 text-sm text-ink-950 placeholder:text-ink-700/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-moss-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-950 mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-ink-700/20 bg-paper-50 px-4 py-2.5 text-sm text-ink-950 placeholder:text-ink-700/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-moss-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-moss-600 hover:bg-moss-700 text-white font-medium text-sm transition-all shadow-md shadow-moss-600/20 focus-ring"
          >
            Create Account & Get Started
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-700/70">
          Already have an account?{' '}
          <Link to="/login" className="text-moss-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
