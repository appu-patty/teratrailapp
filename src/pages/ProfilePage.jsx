import { useAuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, logout } = useAuthContext()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const stats = user?.stats || { totalDistance: 0, totalTime: 0, totalWalks: 0 }

  const formatDistance = (m) => (m / 1000).toFixed(1)
  const formatTime = (s) => {
    const hrs = Math.floor(s / 3600)
    const mins = Math.floor((s % 3600) / 60)
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="profile">
      <div className="profile__header">
        <div className="profile__avatar">
          {user?.displayName?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <h2 className="profile__name">{user?.displayName || 'User'}</h2>
        <p className="profile__joined">
          Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </p>
      </div>

      <div className="profile__stats">
        <div className="profile__stat">
          <span className="profile__stat-value">{formatDistance(stats.totalDistance)}</span>
          <span className="profile__stat-label">km walked</span>
        </div>
        <div className="profile__stat-divider" />
        <div className="profile__stat">
          <span className="profile__stat-value">{stats.totalWalks}</span>
          <span className="profile__stat-label">walks</span>
        </div>
        <div className="profile__stat-divider" />
        <div className="profile__stat">
          <span className="profile__stat-value">{formatTime(stats.totalTime)}</span>
          <span className="profile__stat-label">total time</span>
        </div>
      </div>

      <div className="profile__section">
        <h3 className="profile__section-title">Quick Actions</h3>
        <div className="profile__actions">
          <button className="profile__action" onClick={() => navigate('/start')}>
            <span className="profile__action-icon">⚡</span>
            <span>Start Walking</span>
          </button>
          <button className="profile__action" onClick={() => navigate('/play')}>
            <span className="profile__action-icon">🗺️</span>
            <span>View Map</span>
          </button>
          <button className="profile__action" onClick={() => navigate('/feed')}>
            <span className="profile__action-icon">👥</span>
            <span>View Feed</span>
          </button>
        </div>
      </div>

      <div className="profile__section">
        <h3 className="profile__section-title">Achievements</h3>
        <div className="profile__achievements">
          <div className="profile__badge">
            <span className="profile__badge-icon">🌱</span>
            <span className="profile__badge-label">First Step</span>
          </div>
          <div className="profile__badge profile__badge--locked">
            <span className="profile__badge-icon">🔥</span>
            <span className="profile__badge-label">5 Walks</span>
          </div>
          <div className="profile__badge profile__badge--locked">
            <span className="profile__badge-icon">🏆</span>
            <span className="profile__badge-label">10 km</span>
          </div>
          <div className="profile__badge profile__badge--locked">
            <span className="profile__badge-icon">⭐</span>
            <span className="profile__badge-label">Streak</span>
          </div>
        </div>
      </div>

      <button className="profile__logout" onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  )
}
