import { useAuth } from '../../hooks/useAuth'

const Topbar = () => {
  const { user, logout } = useAuth()

  return (
    <header className="topbar">
      <h1>Smart Maternal & Child Health Management System</h1>
      <div className="topbar-actions">
        <span className="topbar-online">{user?.name || 'Guest'} · {user?.role || 'User'}</span>

        <button className="btn btn-secondary" type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Topbar
