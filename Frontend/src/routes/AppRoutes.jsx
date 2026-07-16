import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import LoginPage from '../pages/auth/Login'
import RegisterPage from '../pages/auth/Register'
import AdminDashboard from '../pages/dashboard/AdminDashboard'
import DoctorDashboard from '../pages/dashboard/DoctorDashboard'
import NurseDashboard from '../pages/dashboard/NurseDashboard'
import MotherDashboard from '../pages/dashboard/MotherDashboard'
import UserListPage from '../pages/users/UserList'
import AddUserPage from '../pages/users/AddUser'
import EditUserPage from '../pages/users/EditUser'
import UserDetailsPage from '../pages/users/UserDetails'
import PregnancyListPage from '../pages/pregnancy/PregnancyList'
import AddPregnancyPage from '../pages/pregnancy/AddPregnancy'
import EditPregnancyPage from '../pages/pregnancy/EditPregnancy'
import PregnancyDetailsPage from '../pages/pregnancy/PregnancyDetails'
import PregnancyTimelinePage from '../pages/pregnancy/PregnancyTimeline'
import AddAncVisitPage from '../pages/pregnancy/AddAncVisit'
import AppointmentListPage from '../pages/appointments/AppointmentList'
import AddAppointmentPage from '../pages/appointments/AddAppointment'
import ProfilePage from '../pages/profile/Profile'
import ChangePasswordPage from '../pages/profile/ChangePassword'
import ReportsPage from '../pages/reports/DashboardReports'
import Layout from '../pages/layout/Layout'
import { useAuth } from '../hooks/useAuth'

const AppRoutes = () => {
  const { user } = useAuth()

  const dashboardByRole = {
    ADMIN: <AdminDashboard />,
    DOCTOR: <DoctorDashboard />,
    NURSE: <NurseDashboard />,
    MOTHER: <MotherDashboard />,
  }

  const DashboardView = () => {
    const role = user?.role?.toUpperCase?.() || 'MOTHER'
    return dashboardByRole[role] || <MotherDashboard />
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        <Route path="dashboard" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
        <Route path="users" element={<ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'NURSE']}><UserListPage /></ProtectedRoute>} />
        <Route path="users/add" element={<ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}><AddUserPage /></ProtectedRoute>} />
        <Route path="users/:id/edit" element={<ProtectedRoute allowedRoles={['ADMIN']}><EditUserPage /></ProtectedRoute>} />
        <Route path="users/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserDetailsPage /></ProtectedRoute>} />
        <Route path="pregnancies" element={<ProtectedRoute allowedRoles={['DOCTOR', 'NURSE', 'MOTHER']}><PregnancyListPage /></ProtectedRoute>} />
        <Route path="pregnancies/add" element={<ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}><AddPregnancyPage /></ProtectedRoute>} />
        <Route path="pregnancies/:id/edit" element={<ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'NURSE']}><EditPregnancyPage /></ProtectedRoute>} />
        <Route path="pregnancies/:id" element={<ProtectedRoute allowedRoles={['DOCTOR', 'NURSE', 'MOTHER']}><PregnancyDetailsPage /></ProtectedRoute>} />
        <Route path="pregnancies/:id/timeline" element={<ProtectedRoute allowedRoles={['DOCTOR', 'NURSE', 'MOTHER']}><PregnancyTimelinePage /></ProtectedRoute>} />
        <Route path="pregnancies/:id/anc-visits/add" element={<ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'NURSE']}><AddAncVisitPage /></ProtectedRoute>} />
        <Route path="appointments" element={<ProtectedRoute allowedRoles={['DOCTOR', 'NURSE', 'MOTHER']}><AppointmentListPage /></ProtectedRoute>} />
        <Route path="appointments/add" element={<ProtectedRoute allowedRoles={['NURSE', 'MOTHER']}><AddAppointmentPage /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'NURSE']}><ReportsPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="profile/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
