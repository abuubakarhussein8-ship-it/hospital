import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useAuth } from '../../hooks/useAuth'

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setRedirecting(false)
    setLoading(true)

    try {
      await login(form)
      setRedirecting(true)
      window.setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setError(err.message || 'Unable to sign in right now.')
      setForm((current) => ({ ...current, password: '' }))
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-hero">
          <div className="hero-badge">SMCHMS</div>
          <h1>SMART Maternal & Child Health Monitoring System</h1>
        </section>

        <section className="auth-card">
          <div className="auth-card-header">
            <h2>Login</h2>
            <p>Ingiza akaunti yako ili uende kwenye dashboard husika.</p>
          </div>

          <form onSubmit={handleSubmit} className="form-stack">
            {error && (
              <div className="login-error-alert" role="alert">
                <span className="login-error-icon" aria-hidden="true">×</span>
                <div>
                  <strong>Oops! Login failed</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}
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
              className={error ? 'login-password-error' : ''}
              required
            />
            <div className={error ? 'login-submit-shake' : ''}>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span className="button-inline-loader">
                    <span className="button-spinner" aria-hidden="true" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
          </form>

          <div className="auth-links">
            <Link to="/register">Create account</Link>
          </div>
        </section>
      </div>
      {redirecting && (
        <div className="login-loading-overlay" role="status" aria-live="polite">
          <div className="login-loading-card">
            <div className="login-loading-spinner" aria-hidden="true" />
            <h2>Signing you in</h2>
            <p>Please wait while we securely prepare your dashboard.</p>
            <div className="login-loading-steps" aria-label="Login progress">
              <span>Verifying account</span>
              <span>Loading dashboard</span>
            </div>
            <div className="login-loading-track" aria-hidden="true">
              <span />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginPage
