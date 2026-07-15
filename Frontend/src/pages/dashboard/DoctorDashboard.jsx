import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { getAppointments } from '../../services/api'
import { getAppointmentStatusMeta } from '../../utils/appointmentStatus'

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const pendingCount = appointments.filter((appointment) => appointment.status === 'PENDING').length
  const upcomingAppointments = appointments.slice(0, 5)

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h2>Doctor Dashboard</h2>
          <p>Review appointments and pregnancy records.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <Card title="Appointments" subtitle="Review requests">
          <p className="empty-state">{appointments.length} appointment records are available.</p>
          <Link to="/appointments"><Button>Open appointment list</Button></Link>
        </Card>
        <Card title="Pending follow-up" subtitle="Awaiting action">
          <p className="empty-state">{pendingCount} appointment(s) still need review.</p>
        </Card>
        <Card title="Pregnancies" subtitle="Monitor records" />
        <Card title="Risk Follow-up" subtitle="Check high risk cases" />
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
