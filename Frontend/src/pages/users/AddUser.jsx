import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import { createUser } from '../../services/api'

const AddUserPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MOTHER' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await createUser(form)
      navigate('/users')
    } catch (err) {
      setError(err.message || 'Unable to create user.')
    }
  }

  return (
    <Card title="Add User" subtitle="Create a secure role-based account">
      <form className="form-stack" onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}
        <Input label="Full name" id="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <Input label="Email address" id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <Input label="Password" id="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <div className="input-group">
          <label htmlFor="role">Role</label>
          <select id="role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="MOTHER">Mother</option>
            <option value="DOCTOR">Doctor</option>
            <option value="NURSE">Nurse</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div className="form-actions">
          <Button type="submit">Save user</Button>
          <Button variant="secondary" onClick={() => navigate('/users')}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}

export default AddUserPage
