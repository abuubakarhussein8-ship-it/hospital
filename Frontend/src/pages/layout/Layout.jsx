import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/layout/Sidebar'
import Topbar from '../../components/layout/Topbar'
import { useAuth } from '../../hooks/useAuth'

const Layout = () => {
  const { user } = useAuth()

  return (
    <div className="app-shell">
      <Sidebar user={user} />
      <div className="main-panel">
        <Topbar />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
