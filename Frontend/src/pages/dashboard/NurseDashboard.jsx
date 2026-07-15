import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { getAppointments, getPregnancies } from '../../services/api'
import { getAppointmentStatusMeta } from '../../utils/appointmentStatus'

const NurseDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [pregnancies, setPregnancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [appointmentData, pregnancyData] = await Promise.all([
          getAppointments(),
          getPregnancies(),
        ])
        setAppointments(appointmentData)
        setPregnancies(pregnancyData)
      } catch (err) {
        setError(err.message || 'Unable to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const pendingAppointments = appointments.filter((appointment) => appointment.status === 'PENDING')
  const latestPregnancies = pregnancies.slice(0, 3)

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h2>Nurse Dashboard</h2>
          <p>Support appointments and maternal monitoring.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <Card title="Appointments" subtitle="Prepare visits">
          <p className="empty-state">{pendingAppointments.length} pending appointment(s) need review.</p>
          <Link to="/appointments"><Button>Review appointments</Button></Link>
        </Card>
        <Card title="Pregnancy Records" subtitle="Update monitoring">
          <p className="empty-state">{pregnancies.length} pregnancy record(s) available.</p>
          <Link to="/pregnancies"><Button>Open records</Button></Link>
        </Card>
        <Card title="Alerts" subtitle="Follow risk cases">
          <p className="empty-state">{pregnancies.filter((pregnancy) => pregnancy.riskStatus?.toLowerCase() === 'high').length} high-risk case(s).</p>
        </Card>
      </div>

      <div className="dashboard-grid">
        <Card title="Latest appointments" subtitle="Upcoming review queue">
          {error && <p className="auth-error">{error}</p>}
          {loading ? (
            <p className="empty-state">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p className="empty-state">No appointments found.</p>
          ) : (
            <ul className="info-list">
              {appointments.slice(0, 4).map((appointment) => {
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

        <Card title="Recent pregnancies" subtitle="Latest ANC tracking">
          {loading ? (
            <p className="empty-state">Loading pregnancies...</p>
          ) : latestPregnancies.length === 0 ? (
            <p className="empty-state">No pregnancy records found.</p>
          ) : (
            <ul className="info-list">
              {latestPregnancies.map((pregnancy) => (
                <li key={pregnancy.id}>
                  <div>
                    <strong>{pregnancy.mother?.name || 'Mother'}</strong>
                    <p>Week {pregnancy.week} • {pregnancy.riskStatus}</p>
                  </div>
                  <div className="info-list-meta">
                    <span>{pregnancy.nextAncVisit || 'No ANC set'}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}

export default NurseDashboard
