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
          <Link to={`/pregnancies/${id}/timeline`}><Button variant="secondary">ANC timeline</Button></Link>
          <Link to={`/pregnancies/${id}/edit`}><Button>Edit</Button></Link>
          <Link to="/pregnancies"><Button variant="secondary">Back</Button></Link>
        </div>
      </div>

      <Card title="Pregnancy record" subtitle="Header ya pregnancy na history muhimu">
        {error && <p className="auth-error">{error}</p>}
        {!pregnancy ? (
          <p className="empty-state">Loading pregnancy...</p>
        ) : (
          <>
            <div className="timeline-strip">
              <div className="timeline-item">
                <strong>Mother profile</strong>
                <div>
                  <p>{pregnancy.mother?.name || 'Current mother'}</p>
                  <p>{pregnancy.mother?.email || 'Not available'}</p>
                </div>
              </div>
            <div className="timeline-item">
              <strong>Pregnancy status</strong>
              <div>
                  <p>LMP: {pregnancy.lmp || 'Not set'}</p>
                  <p>EDD: {pregnancy.edd || 'Not set'}</p>
                  <p>Week {pregnancy.week}</p>
                  <p>Risk: {pregnancy.riskStatus}</p>
                </div>
              </div>
              <div className="timeline-item">
                <strong>Clinical note</strong>
                <div>
                  <p>Pregnancy header only.</p>
                  <p>ANC details live in the visit timeline.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default PregnancyDetailsPage
