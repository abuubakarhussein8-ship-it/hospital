import { useEffect, useState } from 'react'
import Card from '../../components/common/Card'
import { getDashboardData } from '../../services/api'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboardData()
        setStats(data)
      } catch (err) {
        setError(err.message || 'Unable to load dashboard stats.')
      }
    }

    load()
  }, [])

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>System summary for users, pregnancies, and clinic appointments.</p>
        </div>
      </div>
      {error && <p className="auth-error">{error}</p>}
      <div className="dashboard-grid">
        <Card title="System Users" subtitle={stats?.totalUsers ?? '-'} />
        <Card title="Mothers" subtitle={stats?.totalMothers ?? '-'} />
        <Card title="Doctors" subtitle={stats?.totalDoctors ?? '-'} />
        <Card title="Nurses" subtitle={stats?.totalNurses ?? '-'} />
        <Card title="Pregnancies" subtitle={stats?.totalPregnancies ?? '-'} />
        <Card title="Appointments" subtitle={stats?.totalAppointments ?? '-'} />
        <Card title="Pending Appointments" subtitle={stats?.pendingAppointments ?? '-'} />
      </div>
      <Card title="Today in SMCHMS" className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Area</th>
              <th>Important Work</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Appointments</td>
              <td>Review pending mother requests</td>
              <td>{stats?.pendingAppointments ?? 0} pending</td>
            </tr>
            <tr>
              <td>Pregnancies</td>
              <td>Monitor maternal records and risk status</td>
              <td>{stats?.totalPregnancies ?? 0} records</td>
            </tr>
            <tr>
              <td>Users</td>
              <td>Keep doctor, nurse, and mother accounts updated</td>
              <td>{stats?.totalUsers ?? 0} active users</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export default AdminDashboard
