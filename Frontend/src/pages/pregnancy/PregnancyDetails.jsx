import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { getPregnancy } from '../../services/api'

const PregnancyDetailsPage = () => {
  const { id } = useParams()
  const [pregnancy, setPregnancy] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPregnancy = async () => {
      try {
        setPregnancy(await getPregnancy(id))
      } catch (err) {
        setError(err.message || 'Unable to load pregnancy.')
      }
    }

    loadPregnancy()
  }, [id])

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h2>Pregnancy Details</h2>
          <p>Review mother and clinical tracking details.</p>
        </div>
        <div className="actions-row">
          <Link to={`/pregnancies/${id}/edit`}><Button>Edit</Button></Link>
          <Link to="/pregnancies"><Button variant="secondary">Back</Button></Link>
        </div>
      </div>

      <Card>
        {error && <p className="auth-error">{error}</p>}
        {!pregnancy ? (
          <p className="empty-state">Loading pregnancy...</p>
        ) : (
          <div className="detail-grid">
            <div className="detail-item"><span>Mother</span><strong>{pregnancy.mother?.name || 'Current mother'}</strong></div>
            <div className="detail-item"><span>Mother email</span><strong>{pregnancy.mother?.email || 'Not available'}</strong></div>
            <div className="detail-item"><span>Week</span><strong>{pregnancy.week}</strong></div>
            <div className="detail-item"><span>Weight</span><strong>{pregnancy.weight}</strong></div>
            <div className="detail-item"><span>Blood pressure</span><strong>{pregnancy.bloodPressure}</strong></div>
            <div className="detail-item"><span>Risk status</span><strong>{pregnancy.riskStatus}</strong></div>
            <div className="detail-item"><span>Pregnancy status</span><strong>{pregnancy.pregnancyStatus || 'ACTIVE'}</strong></div>
            <div className="detail-item"><span>Next ANC visit</span><strong>{pregnancy.nextAncVisit || 'Not scheduled'}</strong></div>
            <div className="detail-item"><span>ANC notes</span><strong>{pregnancy.ancNotes || 'No ANC notes'}</strong></div>
            <div className="detail-item"><span>Diagnosis</span><strong>{pregnancy.diagnosis || 'Not reviewed yet'}</strong></div>
            <div className="detail-item"><span>Medical notes</span><strong>{pregnancy.medicalNotes || 'No medical notes'}</strong></div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default PregnancyDetailsPage
