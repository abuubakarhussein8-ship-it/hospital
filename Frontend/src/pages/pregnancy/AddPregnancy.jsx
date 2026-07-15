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
    week: '',
    weight: '',
    bloodPressure: '',
    riskStatus: 'LOW',
    pregnancyStatus: 'ACTIVE',
    nextAncVisit: '',
    ancNotes: '',
    diagnosis: '',
    medicalNotes: '',
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
      week: Number(form.week),
      weight: form.weight,

      bloodPressure: form.bloodPressure,
      riskStatus: form.riskStatus,
      pregnancyStatus: form.pregnancyStatus,
      nextAncVisit: form.nextAncVisit || null,
      ancNotes: form.ancNotes,
      diagnosis: form.diagnosis,
      medicalNotes: form.medicalNotes,
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
    <Card title="Register ANC / Pregnancy" subtitle="Nurse records maternal health and next ANC visit">
      <form className="form-stack" onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}

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
        <div className="form-grid two-columns">
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
          <Input
            label="Weight"
            id="weight"
            placeholder="68 kg"
            value={form.weight}
            onChange={(event) => setForm({ ...form, weight: event.target.value })}
            required
          />
          <Input
            label="Blood pressure"
            id="bloodPressure"
            placeholder="120/80"
            value={form.bloodPressure}
            onChange={(event) => setForm({ ...form, bloodPressure: event.target.value })}
            required
          />
          <Input
            label="Next ANC visit"
            id="nextAncVisit"
            type="date"
            value={form.nextAncVisit}
            onChange={(event) => setForm({ ...form, nextAncVisit: event.target.value })}
          />
        </div>
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
          <label htmlFor="ancNotes">ANC visit notes</label>
          <textarea
            id="ancNotes"
            rows="4"
            value={form.ancNotes}
            onChange={(event) => setForm({ ...form, ancNotes: event.target.value })}
          />
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

