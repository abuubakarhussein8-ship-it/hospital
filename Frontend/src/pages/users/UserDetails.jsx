import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { getUser } from '../../services/api'

const UserDetailsPage = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      try {
        setUser(await getUser(id))
      } catch (err) {
        setError(err.message || 'Unable to load user.')
      }
    }

    loadUser()
  }, [id])

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h2>User Details</h2>
          <p>View account profile and role.</p>
        </div>
        <div className="actions-row">
          <Link to={`/users/${id}/edit`}><Button>Edit</Button></Link>
          <Link to="/users"><Button variant="secondary">Back</Button></Link>
        </div>
      </div>

      <Card>
        {error && <p className="auth-error">{error}</p>}
        {!user ? (
          <p className="empty-state">Loading user...</p>
        ) : (
          <div className="detail-grid">
            <div className="detail-item"><span>Name</span><strong>{user.name}</strong></div>
            <div className="detail-item"><span>Email</span><strong>{user.email}</strong></div>
            <div className="detail-item"><span>Role</span><strong>{user.role}</strong></div>
            <div className="detail-item"><span>User ID</span><strong>{user.id}</strong></div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default UserDetailsPage
