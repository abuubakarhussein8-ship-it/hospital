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
          <h2>User Profile</h2>
          <p>Personal account information.</p>
        </div>
        <Link to="/profile/change-password"><Button>Change password</Button></Link>
      </div>

      <Card>
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
          </div>
          <div className="detail-grid">
            <div className="detail-item"><span>Name</span><strong>{user?.name || 'User'}</strong></div>
            <div className="detail-item"><span>Email</span><strong>{user?.email || 'Not available'}</strong></div>
            <div className="detail-item"><span>Role</span><strong>{user?.role || 'User'}</strong></div>
            <div className="detail-item"><span>Status</span><strong>Online</strong></div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ProfilePage
