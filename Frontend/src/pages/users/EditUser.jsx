import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import { getUser, updateUser } from '../../services/api'

const EditUserPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MOTHER' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getUser(id)
        setForm({ name: user.name || '', email: user.email || '', password: '', role: user.role || 'MOTHER' })
      } catch (err) {
        setError(err.message || 'Unable to load user.')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [id])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await updateUser(id, form)
      navigate(`/users/${id}`)
    } catch (err) {
      setError(err.message || 'Unable to update user.')
    }
  }

  if (loading) {
    return <Card><p className="empty-state">Loading user...</p></Card>
  }

  return (
    <Card title="Edit User" subtitle="Update account details">
      <form className="form-stack" onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}
        <Input label="Full name" id="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <Input label="Email address" id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <Input label="New password" id="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
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
          <Button type="submit">Update user</Button>
          <Button variant="secondary" onClick={() => navigate(`/users/${id}`)}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}

export default EditUserPage
