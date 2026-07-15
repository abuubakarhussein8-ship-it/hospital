import { useEffect, useMemo, useState } from 'react'
import Card from '../../components/common/Card'
import { getAppointments, getPregnancies } from '../../services/api'

const DashboardReportsPage = () => {
  const [pregnancies, setPregnancies] = useState([])
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [pregnancyData, appointmentData] = await Promise.all([
          getPregnancies(),
          getAppointments(),
        ])
        setPregnancies(pregnancyData)
        setAppointments(appointmentData)
      } catch (err) {
        setError(err.message || 'Unable to load reports.')
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  const report = useMemo(() => {
    const highRisk = pregnancies.filter((item) => item.riskStatus === 'HIGH').length
    const mediumRisk = pregnancies.filter((item) => item.riskStatus === 'MEDIUM').length
    const activePregnancies = pregnancies.filter((item) => (item.pregnancyStatus || 'ACTIVE') === 'ACTIVE').length
    const pendingAppointments = appointments.filter((item) => item.status === 'PENDING').length
    const completedAppointments = appointments.filter((item) => item.status === 'COMPLETED').length

    return {
      highRisk,
      mediumRisk,
      activePregnancies,
      totalPregnancies: pregnancies.length,
      pendingAppointments,
      completedAppointments,
      totalAppointments: appointments.length,
    }
  }, [appointments, pregnancies])

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h2>Reports Overview</h2>
          <p>Operational health report from pregnancy and appointment records.</p>
        </div>
      </div>

      {error && <p className="auth-error">{error}</p>}
      {loading ? (
        <Card><p className="empty-state">Loading reports...</p></Card>
      ) : (
        <>
          <div className="dashboard-grid">
            <Card title="Pregnancy Records" subtitle={report.totalPregnancies} />
            <Card title="High Risk Cases" subtitle={report.highRisk} />
            <Card title="Medium Risk Cases" subtitle={report.mediumRisk} />
            <Card title="Active Pregnancies" subtitle={report.activePregnancies} />
            <Card title="Appointments" subtitle={report.totalAppointments} />
            <Card title="Pending Appointments" subtitle={report.pendingAppointments} />
          </div>

          <Card title="Clinical Work Summary" className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Real Count</th>
                  <th>Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>High risk cases</td>
                  <td>{report.highRisk}</td>
                  <td>Doctor should review these pregnancy records first.</td>
                </tr>
                <tr>
                  <td>Pending appointments</td>
                  <td>{report.pendingAppointments}</td>
                  <td>Staff should assign doctor or confirm clinic visit.</td>
                </tr>
                <tr>
                  <td>Completed appointments</td>
                  <td>{report.completedAppointments}</td>
                  <td>Closed clinic appointment work.</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </>
      )}
    </div>
  )
}

export default DashboardReportsPage
