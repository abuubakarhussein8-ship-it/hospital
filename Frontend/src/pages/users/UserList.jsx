import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { deleteUser, getUsers } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const UserListPage = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const isAdmin = currentUser?.role === 'ADMIN'

  const loadUsers = async () => {
    try {
      setLoading(true)
      setUsers(await getUsers())
    } catch (err) {
      setError(err.message || 'Unable to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase()
    if (!value) {
      return users
    }

    return users.filter((user) => (
      user.name?.toLowerCase().includes(value)
      || user.email?.toLowerCase().includes(value)
      || user.role?.toLowerCase().includes(value)
    ))
  }, [search, users])

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this user?')
    if (!confirmed) {
      return
    }

    try {
      await deleteUser(id)
      setUsers((current) => current.filter((user) => user.id !== id))
    } catch (err) {
      setError(err.message || 'Unable to delete user.')
    }
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h2>Users</h2>
          <p>{isAdmin ? 'Manage doctors, nurses, mothers, and administrators.' : 'View doctors, nurses, mothers, and administrators.'}</p>
        </div>
        {isAdmin && <Link to="/users/add"><Button>Add New</Button></Link>}
      </div>

      <Card className="table-card">
        <div className="table-toolbar">
          <strong>System User</strong>
          <input
            aria-label="Search users"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        {loading ? (
          <p className="empty-state">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="empty-state">No users found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Email Address</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id?.slice(0, 8)}</td>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td><span className="status-pill status-approved">Active</span></td>
                  {isAdmin && (
                    <td>
                      <div className="actions-row">
                        <Link to={`/users/${user.id}`}>View</Link>
                        <Link to={`/users/${user.id}/edit`}>Edit</Link>
                        <Button variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}

export default UserListPage
