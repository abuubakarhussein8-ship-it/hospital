import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { deletePregnancy, getPregnancies, getPregnanciesByMother } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const PregnancyListPage = () => {
  const { user } = useAuth()
  const [pregnancies, setPregnancies] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const isMother = user?.role === 'MOTHER'
  const canEdit = ['ADMIN', 'DOCTOR', 'NURSE'].includes(user?.role)
  const canDelete = ['ADMIN', 'NURSE'].includes(user?.role)
  const canAdd = ['ADMIN', 'NURSE'].includes(user?.role)

  useEffect(() => {
    const loadPregnancies = async () => {
      try {
        const data = isMother ? await getPregnanciesByMother(user.id) : await getPregnancies()
        setPregnancies(data)
      } catch (err) {
        setError(err.message || 'Unable to load pregnancies.')
      } finally {
        setLoading(false)
      }
    }

    loadPregnancies()
  }, [isMother, user?.id])

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this pregnancy record?')
    if (!confirmed) {
      return
    }

    try {
      await deletePregnancy(id)
      setPregnancies((current) => current.filter((pregnancy) => pregnancy.id !== id))
    } catch (err) {
      setError(err.message || 'Unable to delete pregnancy.')
    }
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h2>Pregnancies</h2>
          <p>{isMother ? 'View your pregnancy and ANC records.' : 'Nurse records ANC details; doctor reviews clinical decisions.'}</p>
        </div>
        {canAdd && <Link to="/pregnancies/add"><Button>Add pregnancy</Button></Link>}
      </div>

      <Card className="table-card">
        {error && <p className="auth-error">{error}</p>}
        {loading ? (
          <p className="empty-state">Loading pregnancies...</p>
        ) : pregnancies.length === 0 ? (
          <p className="empty-state">No pregnancy records found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Mother</th>
                <th>Week</th>
                <th>Weight</th>
                <th>Blood pressure</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Next ANC</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pregnancies.map((pregnancy) => (
                <tr key={pregnancy.id}>
                  <td>{pregnancy.mother?.name || 'Current mother'}</td>
                  <td>{pregnancy.week}</td>
                  <td>{pregnancy.weight}</td>
                  <td>{pregnancy.bloodPressure}</td>
                  <td>{pregnancy.riskStatus}</td>
                  <td>{pregnancy.pregnancyStatus || 'ACTIVE'}</td>
                  <td>{pregnancy.nextAncVisit || '-'}</td>
                  <td>
                    <div className="actions-row">
                      <Link to={`/pregnancies/${pregnancy.id}`}>View</Link>
                      {canEdit && <Link to={`/pregnancies/${pregnancy.id}/edit`}>Edit</Link>}
                      {canDelete && <Button variant="danger" onClick={() => handleDelete(pregnancy.id)}>Delete</Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}

export default PregnancyListPage
