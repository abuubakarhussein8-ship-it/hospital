import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import { createAppointment, getDoctors, getMothers } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const AddAppointmentPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isMother = user?.role === 'MOTHER'
  const isNurse = user?.role === 'NURSE'

  const [mothers, setMothers] = useState([])
  const [doctors, setDoctors] = useState([])
  const [optionsLoaded, setOptionsLoaded] = useState(false)

  const [form, setForm] = useState({
    appointmentDate: '',
    startTime: '',
    endTime: '',
    reason: '',
    notes: '',
    motherId: '',
    doctorId: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const doctorData = await getDoctors()
        setDoctors(doctorData || [])
        setForm((current) => ({ ...current, doctorId: current.doctorId || doctorData?.[0]?.id || '' }))

        if (isNurse) {
          const motherData = await getMothers()
          setMothers(motherData || [])
          setForm((current) => ({
            ...current,
            motherId: current.motherId || motherData?.[0]?.id || '',
          }))
        }
      } catch (err) {
        setError(err.message || 'Unable to load appointment options.')
        setDoctors([])
        setMothers([])
      } finally {
        setOptionsLoaded(true)
      }
    }

    loadOptions()
  }, [isMother])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (isNurse && !form.motherId) {
      setError('Select a mother to save this appointment.')
      return
    }

    if (!form.doctorId) {
      setError('Doctor is required. Please select a doctor from the list.')
      return
    }

    const payload = {
      appointmentDate: form.appointmentDate,
      startTime: form.startTime || null,
      endTime: form.endTime || null,
      reason: form.reason,
      notes: form.notes,
      doctor: { id: form.doctorId },
      ...(isMother ? {} : { mother: { id: form.motherId } }),
    }

    try {
      await createAppointment(payload)
      setSuccess('Appointment saved successfully.')
      window.setTimeout(() => navigate('/appointments'), 1000)
    } catch (err) {
      setError(err.message || 'Unable to create appointment.')
    }
  }

  return (
    <Card title="New Appointment" subtitle="Panga miadi ya kliniki au doctor review kwa mtiririko mzuri">
      <form className="form-stack" onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}
        <div className="form-section">
          <div className="section-title">
            <div>
              <h4>Visit targeting</h4>
              <p>Chagua mama na doctor anayehusika.</p>
            </div>
            <span className="section-chip">Clinic visit</span>
          </div>
          <div className="form-grid two-columns">
            {isNurse && (
              <div className="input-group">
                <label htmlFor="motherId">Mother</label>
                <select id="motherId" value={form.motherId} onChange={(event) => setForm({ ...form, motherId: event.target.value })} required disabled={mothers.length === 0}>
                  <option value="">Select mother</option>
                  {mothers.map((mother) => (
                    <option key={mother.id} value={mother.id}>{mother.name} - {mother.email}</option>
                  ))}
                </select>
                {optionsLoaded && mothers.length === 0 && (
                  <p className="empty-state">No mother accounts found. Admin lazima awe amesajili mother account kwanza.</p>
                )}
              </div>
            )}
            <div className="input-group">
              <label htmlFor="doctorId">Doctor</label>
              <select
                id="doctorId"
                value={form.doctorId}
                onChange={(event) => setForm({ ...form, doctorId: event.target.value })}
                required
                disabled={optionsLoaded && doctors.length === 0}
              >
                <option value="">Select doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
              </select>
              {optionsLoaded && doctors.length === 0 && (
                <p className="empty-state">No doctors loaded. Please contact admin or retry later.</p>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-title">
            <div>
              <h4>Appointment details</h4>
              <p>Tarehe, muda, na sababu ya kikao.</p>
            </div>
          </div>
          <div className="form-grid two-columns">
            <Input label="Appointment date" id="appointmentDate" type="date" value={form.appointmentDate} onChange={(event) => setForm({ ...form, appointmentDate: event.target.value })} required />
            <Input label="Start time" id="startTime" type="time" value={form.startTime} onChange={(event) => setForm({ ...form, startTime: event.target.value })} />
            <Input label="End time" id="endTime" type="time" value={form.endTime} onChange={(event) => setForm({ ...form, endTime: event.target.value })} />
          </div>
        </div>

        <div className="form-section">
          <div className="section-title">
            <div>
              <h4>Purpose and remarks</h4>
              <p>Andika sababu ya miadi na maelezo ya ziada.</p>
            </div>
          </div>
          <div className="form-grid two-columns">
            <div className="input-group">
              <label htmlFor="reason">Purpose of visit</label>
              <textarea id="reason" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} required rows="4" />
            </div>
            <div className="input-group">
              <label htmlFor="notes">Remarks</label>
              <textarea id="notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows="4" />
            </div>
          </div>
        </div>

        <p className="empty-state">Appointment status will start as pending confirmation.</p>
        <div className="form-actions">
          <Button
            type="submit"
            disabled={
              (isNurse && mothers.length === 0) ||
              (optionsLoaded && doctors.length === 0) ||
              !form.doctorId
            }
          >
            Save appointment
          </Button>
          <Button variant="secondary" onClick={() => navigate('/appointments')}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}

export default AddAppointmentPage
