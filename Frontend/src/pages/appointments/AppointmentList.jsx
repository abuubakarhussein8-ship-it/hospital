import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { getAppointments, getDoctors, getMyAppointments, updateAppointmentStatus } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { getAppointmentStatusMeta } from '../../utils/appointmentStatus'

const statusOptions = ['PENDING', 'APPROVED', 'RESCHEDULED', 'REJECTED', 'COMPLETED', 'CANCELLED']

const AppointmentListPage = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const isMother = user?.role === 'MOTHER'
  const canManage = ['ADMIN', 'DOCTOR', 'NURSE'].includes(user?.role)

  useEffect(() => {
    const load = async () => {
      try {
        const appointmentData = isMother ? await getMyAppointments() : await getAppointments()
        setAppointments(appointmentData)

        if (canManage) {
          setDoctors(await getDoctors())
        }
      } catch (err) {
        setError(err.message || 'Unable to load appointments.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [canManage, isMother])

  const filteredAppointments = useMemo(() => {
    const value = search.trim().toLowerCase()
    if (!value) {
      return appointments
    }

    return appointments.filter((appointment) => (
      appointment.mother?.name?.toLowerCase().includes(value)
      || appointment.doctor?.name?.toLowerCase().includes(value)
      || appointment.reason?.toLowerCase().includes(value)
      || appointment.status?.toLowerCase().includes(value)
    ))
  }, [appointments, search])

  const latestAppointment = appointments[0]
  const latestStatus = latestAppointment ? getAppointmentStatusMeta(latestAppointment.status) : null

  const handleStatusChange = async (appointment, status) => {
    try {
      const updated = await updateAppointmentStatus(appointment.id, {
        status,
        doctorId: appointment.doctor?.id || null,
        notes: appointment.notes || '',
      })
      setAppointments((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch (err) {
      setError(err.message || 'Unable to update appointment.')
    }
  }

  const handleDoctorChange = async (appointment, doctorId) => {
    try {
      const updated = await updateAppointmentStatus(appointment.id, {
        status: appointment.status,
        doctorId: doctorId || null,
        notes: appointment.notes || '',
      })
      setAppointments((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch (err) {
      setError(err.message || 'Unable to assign doctor.')
    }
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h2>Appointments</h2>
          <p>{isMother ? 'Request and follow your clinic appointments.' : 'Review mother appointment requests.'}</p>
        </div>
        <Link to="/appointments/add"><Button>Add appointment</Button></Link>
      </div>

      {isMother && (
        <Card title="Status update" subtitle="Your latest appointment request">
          {latestAppointment ? (
            <div className="status-summary">
              <p><strong>{latestAppointment.reason}</strong> for {latestAppointment.appointmentDate}</p>
              <p>{latestStatus?.message}</p>
              <span className={`status-pill ${latestStatus?.badgeClass}`}>{latestStatus?.label}</span>
            </div>
          ) : (
            <p className="empty-state">No appointments yet.</p>
          )}
        </Card>
      )}

      <Card className="table-card">
        <div className="table-toolbar">
          <strong>{isMother ? 'My appointments' : 'Appointment requests'}</strong>
          <input
            aria-label="Search appointments"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {error && <p className="auth-error">{error}</p>}
        {loading ? (
          <p className="empty-state">Loading appointments...</p>
        ) : filteredAppointments.length === 0 ? (
          <p className="empty-state">No appointments found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Mother</th>
                <th>Purpose</th>
                <th>Doctor</th>
                <th>Remarks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => {
                const statusMeta = getAppointmentStatusMeta(appointment.status)

                return (
                  <tr key={appointment.id}>
                    <td>{appointment.appointmentDate}</td>
                    <td>{appointment.startTime || '-'} {appointment.endTime ? `- ${appointment.endTime}` : ''}</td>
                    <td>{appointment.mother?.name || user?.name}</td>
                    <td>{appointment.reason}</td>
                    <td>
                      {canManage ? (
                        <select value={appointment.doctor?.id || ''} onChange={(event) => handleDoctorChange(appointment, event.target.value)}>
                          <option value="">Not assigned</option>
                          {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                          ))}
                        </select>
                      ) : (
                        appointment.doctor?.name || 'Not assigned'
                      )}
                    </td>
                    <td>{appointment.notes || '-'}</td>
                    <td>
                      {canManage ? (
                        <select value={appointment.status} onChange={(event) => handleStatusChange(appointment, event.target.value)}>
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>{getAppointmentStatusMeta(status).label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`status-pill ${statusMeta.badgeClass}`}>{statusMeta.label}</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}

export default AppointmentListPage
