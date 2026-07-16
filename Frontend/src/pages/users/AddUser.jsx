import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import { createUser } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const AddUserPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'DOCTOR' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()
  const isNurse = user?.role?.toUpperCase?.() === 'NURSE'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await createUser({ ...form, role: isNurse ? 'MOTHER' : form.role })
      navigate(isNurse ? '/pregnancies/add' : '/users')
    } catch (err) {
      setError(err.message || 'Unable to create user.')
    }
  }

  return (
    <Card
      title={isNurse ? 'Register mother' : 'Add User'}
      subtitle={isNurse ? 'Sajili mother account kabla ya kuanza pregnancy record.' : 'Admin huunda doctor, nurse, na mother accounts hapa.'}
    >
      <form className="form-stack" onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}
        <div className="form-section">
          <div className="section-title">
            <div>
              <h4>Account details</h4>
              <p>{isNurse ? 'Jina na email za mother.' : 'Jina na email za mtumiaji wa mfumo.'}</p>
            </div>
          </div>
          <div className="form-grid two-columns">
            <Input label="Full name" id="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            <Input label="Email address" id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </div>
        </div>
        <div className="form-section">
          <div className="section-title">
            <div>
              <h4>{isNurse ? 'Account security' : 'Security & role'}</h4>
              <p>{isNurse ? 'Account hii itasajiliwa kama Mother.' : 'Admin anaamua role sahihi kabla ya account kuendelea.'}</p>
            </div>
          </div>
          <div className="form-grid two-columns">
            <Input label="Password" id="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
            {!isNurse && (
              <div className="input-group">
                <label htmlFor="role">Role</label>
                <select id="role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                  <option value="DOCTOR">Doctor</option>
                  <option value="NURSE">Nurse</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            )}
          </div>
        </div>
        <div className="form-actions">
          <Button type="submit">{isNurse ? 'Register mother' : 'Save user'}</Button>
          <Button variant="secondary" onClick={() => navigate(isNurse ? '/dashboard' : '/users')}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}

export default AddUserPage
