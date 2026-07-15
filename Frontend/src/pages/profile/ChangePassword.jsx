import { useState } from 'react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { changePassword } from '../../services/api'

const ChangePasswordPage = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmation: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value })
  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (form.newPassword !== form.confirmation) return setError('New password and confirmation do not match.')
    try {
      const response = await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      setSuccess(response.message || 'Password changed successfully.')
      setForm({ currentPassword: '', newPassword: '', confirmation: '' })
    } catch (err) { setError(err.message || 'Unable to change password.') }
  }
  return <Card title="Change Password" subtitle="Use at least 8 characters."><form className="form-stack" onSubmit={handleSubmit}>
    {error && <p className="auth-error">{error}</p>}{success && <p className="auth-success">{success}</p>}
    <Input label="Current password" id="current-password" type="password" value={form.currentPassword} onChange={update('currentPassword')} required />
    <Input label="New password" id="new-password" type="password" value={form.newPassword} onChange={update('newPassword')} minLength="8" required />
    <Input label="Confirm new password" id="confirm-password" type="password" value={form.confirmation} onChange={update('confirmation')} minLength="8" required />
    <Button type="submit">Change password</Button>
  </form></Card>
}

export default ChangePasswordPage
