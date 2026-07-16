import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { useAuth } from '../../hooks/useAuth'

const ProfilePage = () => {
  const { user, updateProfileImage } = useAuth()

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      updateProfileImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h2>My Profile</h2>
          <p>Account details, photo, and access role.</p>
        </div>
        <div className="actions-row">
          <Link to="/profile/change-password"><Button>Change password</Button></Link>
        </div>
      </div>

      <Card title="Profile summary" subtitle="A clean view of your account and photo">
        <div className="profile-panel">
          <div className="profile-photo-box">
            {user?.profileImage ? (
              <img className="profile-photo" src={user.profileImage} alt="" />
            ) : (
              <div className="profile-avatar">{user?.name?.slice(0, 1)?.toUpperCase() || 'U'}</div>
            )}
            <label className="photo-upload">
              Upload photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} />
            </label>
            <div className="profile-quick">
              <span className="section-chip">{user?.role || 'User'}</span>
              <span className="status-pill status-approved">Online</span>
            </div>
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <span>Name</span>
              <strong>{user?.name || 'User'}</strong>
            </div>
            <div className="detail-item">
              <span>Email</span>
              <strong>{user?.email || 'Not available'}</strong>
            </div>
            <div className="detail-item">
              <span>Role</span>
              <strong>{user?.role || 'User'}</strong>
            </div>
            <div className="detail-item">
              <span>Status</span>
              <strong>Active session</strong>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ProfilePage
