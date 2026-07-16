import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import { getMothers, getPregnancy, updatePregnancy } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const EditPregnancyPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const isDoctor = user?.role === 'DOCTOR'
  const isNurse = user?.role === 'NURSE'
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [pregnancy, motherOptions] = await Promise.all([
          getPregnancy(id),
          getMothers(),
        ])
        setMothers(motherOptions)
        setForm({
          motherId: pregnancy.mother?.id || motherOptions[0]?.id || '',
          lmp: pregnancy.lmp || '',
          edd: pregnancy.edd || '',
          week: pregnancy.week || '',
          riskStatus: pregnancy.riskStatus || 'LOW',
          pregnancyStatus: pregnancy.pregnancyStatus || 'ACTIVE',
        })
      } catch (err) {
        setError(err.message || 'Unable to load pregnancy.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

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
      await updatePregnancy(id, payload)
      navigate(`/pregnancies/${id}`)
    } catch (err) {
      setError(err.message || 'Unable to update pregnancy.')
    }
  }

  if (loading) {
    return <Card><p className="empty-state">Loading pregnancy...</p></Card>
  }

  return (
    <Card title="Edit ANC / Pregnancy" subtitle={isDoctor ? 'Doctor reviews risk, diagnosis, and medical decision' : 'Nurse updates ANC and maternal health information'}>
      <form className="form-stack" onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}
        <div className="input-group">
          <label htmlFor="motherId">Mother</label>
          <select id="motherId" value={form.motherId} onChange={(event) => setForm({ ...form, motherId: event.target.value })} required disabled={isDoctor}>
            <option value="">Select mother</option>
            {mothers.map((mother) => (
              <option key={mother.id} value={mother.id}>{mother.name} - {mother.email}</option>
            ))}
          </select>
        </div>
        <div className="form-grid two-columns">
          <Input label="LMP" id="lmp" type="date" value={form.lmp} onChange={(event) => setForm({ ...form, lmp: event.target.value })} disabled={isDoctor} />
          <Input label="EDD" id="edd" type="date" value={form.edd} onChange={(event) => setForm({ ...form, edd: event.target.value })} disabled={isDoctor} />
          <Input label="Pregnancy week" id="week" type="number" min="1" max="42" value={form.week} onChange={(event) => setForm({ ...form, week: event.target.value })} required disabled={isDoctor} />
          <div className="input-group">
            <label htmlFor="riskStatus">Risk status</label>
            <select id="riskStatus" value={form.riskStatus} onChange={(event) => setForm({ ...form, riskStatus: event.target.value })}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="pregnancyStatus">Pregnancy status</label>
          <select id="pregnancyStatus" value={form.pregnancyStatus} onChange={(event) => setForm({ ...form, pregnancyStatus: event.target.value })}>
            <option value="ACTIVE">Active</option>
            <option value="UNDER_REVIEW">Under review</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        <div className="form-actions">
          <Button type="submit">Update pregnancy</Button>
          <Button variant="secondary" onClick={() => navigate(`/pregnancies/${id}`)}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}

export default EditPregnancyPage
