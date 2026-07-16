import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { useAuth } from '../../hooks/useAuth'
import { getAppointments } from '../../services/api'
import { getAppointmentStatusMeta } from '../../utils/appointmentStatus'

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    const load = async () => {
      try {
        const appointmentData = await getAppointments()
        setAppointments(appointmentData)
      } catch (err) {
        setError(err.message || 'Unable to load appointments.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const assignedAppointments = appointments.filter((appointment) => appointment.doctor?.id === user?.id)
  const pendingCount = assignedAppointments.filter((appointment) => appointment.status === 'PENDING').length
  const upcomingAppointments = assignedAppointments.slice(0, 5)

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h2>Doctor Dashboard</h2>
          <p>Doctor anaona wagonjwa waliomuhusu tu, pamoja na review zake za ANC na appointment.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <Card title="Assigned appointments" subtitle="Review requests">
          <p className="empty-state">{assignedAppointments.length} appointment record(s) are assigned to you.</p>
          <Link to="/appointments"><Button>Open appointment list</Button></Link>
        </Card>
        <Card title="Clinical review" subtitle="Diagnosis and advice">
          <p className="empty-state">Pitia ANC timeline, andika diagnosis, na toa advice ya kliniki.</p>
        </Card>
        <Card title="Pending follow-up" subtitle="Awaiting action">
          <p className="empty-state">{pendingCount} appointment(s) still need review.</p>
        </Card>
        <Card title="High-risk cases" subtitle="Check risk first">
          <p className="empty-state">High-risk cases hupewa attention ya kwanza.</p>
        </Card>
      </div>

      <Card title="Upcoming appointments" subtitle="Latest requests for review">
        {error && <p className="auth-error">{error}</p>}
        {loading ? (
          <p className="empty-state">Loading appointments...</p>
        ) : upcomingAppointments.length === 0 ? (
          <p className="empty-state">No appointments found.</p>
        ) : (
          <ul className="info-list">
            {upcomingAppointments.map((appointment) => {
              const statusMeta = getAppointmentStatusMeta(appointment.status)
              return (
                <li key={appointment.id}>
                  <div>
                    <strong>{appointment.mother?.name || 'Mother'}</strong>
                    <p>{appointment.reason}</p>
                  </div>
                  <div className="info-list-meta">
                    <span>{appointment.appointmentDate}</span>
                    <span className={`status-pill ${statusMeta.badgeClass}`}>{statusMeta.label}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </div>
  )
}

export default DoctorDashboard
