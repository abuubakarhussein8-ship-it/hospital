import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useAuth } from '../../hooks/useAuth'

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      await login(form)
      setSuccess('Login successful.')
      window.setTimeout(() => navigate('/dashboard'), 1000)
    } catch (err) {
      setError(err.message || 'Unable to sign in right now.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-hero">
          <div className="hero-badge">SMCHMS</div>
          <h1>Secure care starts with a connected system.</h1>
          <p>
            Access maternal and child health records with confidence through our
            trusted hospital-grade platform.
          </p>
          <div className="hero-icons" aria-label="Healthcare features">
            <span>🩺 Clinical access</span>
            <span>🧒 Maternal care</span>
            <span>❤️ Patient safety</span>
          </div>
          <ul>
            <li>Real-time patient monitoring</li>
            <li>Protected clinical data access</li>
            <li>Role-based dashboards for every team</li>
          </ul>
        </section>

        <section className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="form-stack">
            {error && <p className="auth-error">{error}</p>}
            {success && <p className="auth-success">{success}</p>}
            <Input
              label="Email address"
              id="email"
              type="email"
              placeholder="you@hospital.org"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Button type="submit">Sign In</Button>
          </form>

          <div className="auth-links">
            <Link to="/register">Create account</Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LoginPage
