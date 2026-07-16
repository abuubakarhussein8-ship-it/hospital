import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { useAuth } from '../../hooks/useAuth'
import { getAncVisits, getMyAppointments, getPregnanciesByMother } from '../../services/api'
import { getAppointmentStatusMeta } from '../../utils/appointmentStatus'

const MotherDashboard = () => {
  const { user } = useAuth()
  const [pregnancies, setPregnancies] = useState([])
  const [appointments, setAppointments] = useState([])
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [pregnancyData, appointmentData] = await Promise.all([
          getPregnanciesByMother(user?.id),
          getMyAppointments(),
        ])
        setPregnancies(pregnancyData)
        setAppointments(appointmentData)

        const latestPregnancyId = pregnancyData?.[0]?.id
        if (latestPregnancyId) {
          setVisits(await getAncVisits(latestPregnancyId))
        }
      } catch (err) {
        setError(err.message || 'Unable to load your dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      load()
    }
  }, [user?.id])

  const latestPregnancy = pregnancies[0]
  const latestAppointment = appointments[0]
  const latestStatus = latestAppointment ? getAppointmentStatusMeta(latestAppointment.status) : null

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h2>Mother Dashboard</h2>
          <p>Hapa mama anaona pregnancy progress, miadi, na hatua inayofuata ya clinic.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <Card title="My pregnancy" subtitle="View records">
          {loading ? (
            <p className="empty-state">Loading pregnancy records...</p>
          ) : latestPregnancy ? (
            <div className="status-summary">
              <p><strong>Week {latestPregnancy.week}</strong></p>
              <p>Risk: {latestPregnancy.riskStatus}</p>
              <p>Next ANC: {latestPregnancy.nextAncVisit || 'Not scheduled yet'}</p>
              <Link to="/pregnancies"><Button>View all records</Button></Link>
            </div>
          ) : (
            <p className="empty-state">No pregnancy records found.</p>
          )}
        </Card>

        <Card title="My appointments" subtitle="Request doctor visit">
          {loading ? (
            <p className="empty-state">Loading appointments...</p>
          ) : latestAppointment ? (
            <div className="status-summary">
              <p><strong>{latestAppointment.reason}</strong></p>
              <p>{latestAppointment.appointmentDate}</p>
              <span className={`status-pill ${latestStatus?.badgeClass}`}>{latestStatus?.label}</span>
              <Link to="/appointments"><Button>Manage appointments</Button></Link>
            </div>
          ) : (
            <p className="empty-state">No appointments yet.</p>
          )}
        </Card>

        <Card title="My ANC visits" subtitle="Latest clinic timeline">
          {loading ? (
            <p className="empty-state">Loading ANC visits...</p>
          ) : visits.length === 0 ? (
            <p className="empty-state">No ANC visits recorded yet.</p>
          ) : (
            <div className="timeline-strip">
              {visits.slice(0, 3).map((visit, index) => (
                <div key={visit.id} className="timeline-item">
                  <strong>Visit {index + 1}</strong>
                  <div>
                    <p>{visit.visitDate} • Week {visit.week}</p>
                    <p>BP {visit.bloodPressure || '-'} | Weight {visit.weight || '-'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="What to do next" subtitle="Follow clinic advice">
          {error && <p className="auth-error">{error}</p>}
          <p className="empty-state">Check ANC date, prepare health records, and follow the clinic advice you received.</p>
        </Card>
      </div>
    </div>
  )
}

export default MotherDashboard
