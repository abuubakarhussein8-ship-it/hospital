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
          <p>Hapa ndipo follow-up ya mama, pregnancy, na ANC visit zinapopangwa kwa utulivu.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <Card title="Register mother" subtitle="Create or open mother profile">
          <p className="empty-state">Anza kwa profile moja ya mama kabla ya pregnancy au ANC.</p>
          <Link to="/users/add"><Button>Register mother</Button></Link>
        </Card>
        <Card title="Create pregnancy" subtitle="Start active pregnancy">
          <p className="empty-state">{pregnancies.length} pregnancy record(s) are available.</p>
          <Link to="/pregnancies/add"><Button>Create pregnancy</Button></Link>
        </Card>
        <Card title="Today&apos;s review" subtitle="Follow active ANC work">
          <p className="empty-state">{pendingAppointments.length} pending appointment(s) need review.</p>
          <Link to="/appointments"><Button>Review appointments</Button></Link>
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
