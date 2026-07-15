import { NavLink } from 'react-router-dom'

const navItemsByRole = {
  ADMIN: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/users', label: 'Users' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/reports', label: 'Reports' },
    { to: '/profile', label: 'Profile' },
  ],
  DOCTOR: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/users', label: 'Users' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/pregnancies', label: 'Pregnancies' },
    { to: '/reports', label: 'Reports' },
    { to: '/profile', label: 'Profile' },
  ],
  NURSE: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/users', label: 'Users' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/pregnancies', label: 'Pregnancies' },
    { to: '/reports', label: 'Reports' },
    { to: '/profile', label: 'Profile' },
  ],
  MOTHER: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/pregnancies', label: 'Pregnancies' },
    { to: '/profile', label: 'Profile' },
  ],
}

const Sidebar = ({ user }) => {
  const role = user?.role?.toUpperCase?.() || 'MOTHER'
  const navItems = navItemsByRole[role] || navItemsByRole.MOTHER

  return (
    <aside className="sidebar">
      <div className="brand">
        {user?.profileImage ? (
          <img className="brand-photo" src={user.profileImage} alt="" />
        ) : (
          <div className="brand-mark">{user?.name?.slice(0, 1)?.toUpperCase() || 'SM'}</div>
        )}
        <div>
          <h2>SMCHMS</h2>
          <p>Hello, {user?.name || role}</p>
        </div>
      </div>

      <nav>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className="nav-link">
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
