import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import './LoginPage.css'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, register, isAuthenticated } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/play', { replace: true })
    }
  }, [isAuthenticated, navigate])

  if (isAuthenticated) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const result = isRegister
      ? register(username, password)
      : login(username, password)

    if (result.success) {
      navigate('/play', { replace: true })
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="login">
      <div className="login__bg">
        <div className="login__orb login__orb--1" />
        <div className="login__orb login__orb--2" />
        <div className="login__grid" />
      </div>

      <div className="login__content">
        <div className="login__brand animate-fade-in">
          <h1 className="login__logo">
            <span className="login__logo-accent">Terra</span>Trail
          </h1>
          <p className="login__tagline">See your walks come alive</p>
        </div>

        <form className="login__card animate-slide-up" onSubmit={handleSubmit}>
          <h2 className="login__title">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="login__subtitle">
            {isRegister
              ? 'Start tracking your journey'
              : 'Sign in to continue'}
          </p>

          {error && <div className="login__error">{error}</div>}

          <div className="login__field">
            <label className="login__label" htmlFor="username">Username</label>
            <input
              id="username"
              className="login__input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>

          <div className="login__field">
            <label className="login__label" htmlFor="password">Password</label>
            <input
              id="password"
              className="login__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
            />
          </div>

          <button type="submit" className="login__submit" id="btn-login">
            {isRegister ? 'Sign Up' : 'Sign In'}
          </button>

          <p className="login__toggle">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="login__toggle-btn"
              onClick={() => { setIsRegister(!isRegister); setError('') }}
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
