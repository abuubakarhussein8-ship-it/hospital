import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { registerUser } from '../../services/api'

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.')
        return
      }

      // Backend inatarajia password pekee
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
      }

      await registerUser(payload)
      setSuccess('Registration successful.')
      window.setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError(err.message || 'Unable to create account right now.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-hero">
          <div className="hero-badge">SMCHMS</div>
          <h1>Register mother account only.</h1>
        </section>

        <section className="auth-card">
          <div className="auth-card-header">
            <h2>Create account</h2>
            <p>Form safi ya kuanzisha profile ya mama katika mfumo.</p>
          </div>

          <form className="form-stack" onSubmit={handleSubmit}>
            {error && <p className="auth-error">{error}</p>}
            {success && <p className="auth-success">{success}</p>}
            <Input label="Full name" id="name" placeholder="Jane Doe" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            <Input label="Email address" id="email" type="email" placeholder="you@hospital.org" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            <Input label="Password" id="password" type="password" placeholder="Create a password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
            <Input
              label="Confirm password"
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
              required
            />
            <Button type="submit">Register</Button>
          </form>

          <div className="auth-links">
            <Link to="/login">Back to login</Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default RegisterPage
