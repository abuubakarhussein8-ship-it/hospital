import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import { createPregnancy, getMothers } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const AddPregnancyPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [mothers, setMothers] = useState([])
  const [form, setForm] = useState({
    motherId: '',
    lmp: '',
    edd: '',
    week: '',
    riskStatus: 'LOW',
    pregnancyStatus: 'ACTIVE',
  })
  const [error, setError] = useState('')
  const [loadingMothers, setLoadingMothers] = useState(false)

  useEffect(() => {
    const loadMothers = async () => {
      setError('')

      const token = localStorage.getItem('token')
      if (!token || !user) {
        setError('Please login to register ANC / pregnancy.')
        return
      }

      // /api/v1/users/mothers is role-protected (ADMIN/DOCTOR/NURSE)
      if (!['ADMIN', 'DOCTOR', 'NURSE'].includes(String(user.role).toUpperCase())) {
        setError('Your account role cannot load mothers. Please login as ADMIN, DOCTOR, or NURSE.')
        return
      }

      try {
        setLoadingMothers(true)
        const data = await getMothers()
        setMothers(data)
        setForm((current) => ({ ...current, motherId: current.motherId || data[0]?.id || '' }))
      } catch (err) {
        setError(err.message || 'Unable to load mothers.')
      } finally {
        setLoadingMothers(false)
      }
    }

    loadMothers()
  }, [user])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const payload = {
      lmp: form.lmp || null,
      edd: form.edd || null,
      week: Number(form.week),
      riskStatus: form.riskStatus,
      pregnancyStatus: form.pregnancyStatus,
      mother: { id: form.motherId },
    }

    try {
      await createPregnancy(payload)
      navigate('/pregnancies')
    } catch (err) {
      setError(err.message || 'Unable to create pregnancy.')
    }
  }

  return (
    <Card title="New Pregnancy" subtitle="Nurse anaunganisha pregnancy mpya kwa profile ya mama mmoja">
      <form className="form-stack" onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}
        <div className="form-section">
          <div className="section-title">
            <div>
              <h4>Mother selection</h4>
              <p>Chagua mama ambaye tayari ana profile ya hospitali.</p>
            </div>
            <span className="section-chip">Profile moja</span>
          </div>
          <div className="input-group">
            <label htmlFor="motherId">Mother</label>
            <select
              id="motherId"
              value={form.motherId}
              onChange={(event) => setForm({ ...form, motherId: event.target.value })}
              required
              disabled={loadingMothers || mothers.length === 0}
            >
              <option value="">{loadingMothers ? 'Loading...' : 'Select mother'}</option>
              {mothers.map((mother) => (
                <option key={mother.id} value={mother.id}>
                  {mother.name} - {mother.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <div className="section-title">
            <div>
              <h4>Pregnancy overview</h4>
              <p>Hapa tunaweka taarifa ya msingi ya ujauzito.</p>
            </div>
            <span className="section-chip">Active pregnancy</span>
          </div>
          <div className="form-grid two-columns">
            <Input
              label="LMP"
              id="lmp"
              type="date"
              value={form.lmp}
              onChange={(event) => setForm({ ...form, lmp: event.target.value })}
            />
            <Input
              label="EDD"
              id="edd"
              type="date"
              value={form.edd}
              onChange={(event) => setForm({ ...form, edd: event.target.value })}
            />
            <Input
              label="Pregnancy week"
              id="week"
              type="number"
              min="1"
              max="42"
              value={form.week}
              onChange={(event) => setForm({ ...form, week: event.target.value })}
              required
            />
            <div className="input-group">
              <label htmlFor="riskStatus">Risk status</label>
              <select
                id="riskStatus"
                value={form.riskStatus}
                onChange={(event) => setForm({ ...form, riskStatus: event.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="pregnancyStatus">Pregnancy status</label>
              <select
                id="pregnancyStatus"
                value={form.pregnancyStatus}
                onChange={(event) => setForm({ ...form, pregnancyStatus: event.target.value })}
              >
                <option value="ACTIVE">Active</option>
                <option value="DELIVERED">Delivered</option>
                <option value="REFERRED">Referred</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>
        <div className="form-actions">
          <Button type="submit">Save pregnancy</Button>
          <Button variant="secondary" onClick={() => navigate('/pregnancies')}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default AddPregnancyPage
