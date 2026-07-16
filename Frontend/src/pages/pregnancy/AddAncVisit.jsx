import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import { createAncVisit } from '../../services/api'

const AddAncVisitPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    visitDate: '',
    week: '',
    weight: '',
    bloodPressure: '',
    temperature: '',
    hb: '',
    notes: '',
    diagnosis: '',
    nextVisitDate: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await createAncVisit(id, {
        visitDate: form.visitDate,
        week: Number(form.week),
        weight: form.weight,
        bloodPressure: form.bloodPressure,
        temperature: form.temperature,
        hb: form.hb,
        notes: form.notes,
        diagnosis: form.diagnosis,
        nextVisitDate: form.nextVisitDate || null,
      })
      navigate(`/pregnancies/${id}/timeline`)
    } catch (err) {
      setError(err.message || 'Unable to save ANC visit.')
    }
  }

  return (
    <Card title="New ANC Visit" subtitle="Leta ziara moja ya kweli kwa pregnancy hii">
      <form className="form-stack" onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}
        <div className="form-grid two-columns">
          <Input label="Visit date" id="visitDate" type="date" value={form.visitDate} onChange={(event) => setForm({ ...form, visitDate: event.target.value })} required />
          <Input label="Week" id="week" type="number" min="1" max="42" value={form.week} onChange={(event) => setForm({ ...form, week: event.target.value })} required />
          <Input label="Weight" id="weight" value={form.weight} onChange={(event) => setForm({ ...form, weight: event.target.value })} />
          <Input label="Blood pressure" id="bloodPressure" value={form.bloodPressure} onChange={(event) => setForm({ ...form, bloodPressure: event.target.value })} />
          <Input label="Temperature" id="temperature" value={form.temperature} onChange={(event) => setForm({ ...form, temperature: event.target.value })} />
          <Input label="HB" id="hb" value={form.hb} onChange={(event) => setForm({ ...form, hb: event.target.value })} />
          <Input label="Next visit date" id="nextVisitDate" type="date" value={form.nextVisitDate} onChange={(event) => setForm({ ...form, nextVisitDate: event.target.value })} />
        </div>
        <div className="form-grid two-columns">
          <div className="input-group">
            <label htmlFor="notes">ANC notes</label>
            <textarea id="notes" rows="4" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          </div>
          <div className="input-group">
            <label htmlFor="diagnosis">Doctor diagnosis</label>
            <textarea id="diagnosis" rows="4" value={form.diagnosis} onChange={(event) => setForm({ ...form, diagnosis: event.target.value })} />
          </div>
        </div>
        <div className="form-actions">
          <Button type="submit">Save visit</Button>
          <Link to={`/pregnancies/${id}/timeline`}><Button variant="secondary">Cancel</Button></Link>
        </div>
      </form>
    </Card>
  )
}

export default AddAncVisitPage
