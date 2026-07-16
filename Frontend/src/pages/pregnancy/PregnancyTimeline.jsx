import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { getAncVisits, getPregnancy } from '../../services/api'

const PregnancyTimelinePage = () => {
  const { id } = useParams()
  const [pregnancy, setPregnancy] = useState(null)
  const [visits, setVisits] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPregnancy = async () => {
      try {
        const [pregnancyData, visitData] = await Promise.all([
          getPregnancy(id),
          getAncVisits(id),
        ])
        setPregnancy(pregnancyData)
        setVisits(visitData)
      } catch (err) {
        setError(err.message || 'Unable to load pregnancy timeline.')
      }
    }

    loadPregnancy()
  }, [id])

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h2>ANC Timeline</h2>
          <p>Muhtasari wa safari ya pregnancy kwa mtiririko mmoja rahisi kusoma.</p>
        </div>
        <div className="actions-row">
          <Link to={`/pregnancies/${id}/anc-visits/add`}><Button>Add ANC visit</Button></Link>
          <Link to={`/pregnancies/${id}`}><Button variant="secondary">Back to pregnancy</Button></Link>
        </div>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <Card title="Timeline overview" subtitle="Steps from registration to review">
        {!pregnancy ? (
          <p className="empty-state">Loading timeline...</p>
        ) : (
          <div className="timeline-strip">
            <div className="timeline-item">
              <strong>Pregnancy dates</strong>
              <div>
                <p>LMP: {pregnancy.lmp || 'Not set'}</p>
                <p>EDD: {pregnancy.edd || 'Not set'}</p>
              </div>
            </div>
            <div className="timeline-item">
              <strong>Mother profile</strong>
              <div>
                <p>{pregnancy.mother?.name || 'Current mother'}</p>
                <p>{pregnancy.mother?.email || 'Not available'}</p>
              </div>
            </div>
            <div className="timeline-item">
              <strong>Pregnancy started</strong>
              <div>
                <p>Week {pregnancy.week || '-'}</p>
                <p>Status: {pregnancy.pregnancyStatus || 'ACTIVE'}</p>
              </div>
            </div>
            {visits.length === 0 ? (
              <div className="timeline-item">
                <strong>ANC visits</strong>
                <div>
                  <p>No ANC visits recorded yet.</p>
                  <p>Register the first visit when the mother comes to clinic.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="timeline-item">
                  <strong>Latest ANC visit</strong>
                  <div>
                    <p>{visits[visits.length - 1].visitDate} • Week {visits[visits.length - 1].week}</p>
                    <p>BP {visits[visits.length - 1].bloodPressure || '-'} | Weight {visits[visits.length - 1].weight || '-'}</p>
                    <p>{visits[visits.length - 1].notes || 'No notes'}</p>
                  </div>
                </div>
                {visits.slice(0, -1).reverse().map((item, index) => (
                  <div key={item.id} className="timeline-item">
                    <strong>{`Visit ${visits.length - index}`}</strong>
                    <div>
                      <p>{item.visitDate} • Week {item.week}</p>
                      <p>BP {item.bloodPressure || '-'} | Weight {item.weight || '-'}</p>
                      <p>{item.notes || 'No notes'}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

export default PregnancyTimelinePage
