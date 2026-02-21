import { useAuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, logout, updateColor } = useAuthContext()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const COLORS = [
    { name: 'Mint', value: '#4aedc4' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Pink', value: '#ec4899' },
  ]

  const currentColor = user?.color || '#4aedc4'

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
        <div
          className="profile__avatar"
          style={{
            background: `linear-gradient(135deg, ${currentColor}, ${currentColor}dd)`,
            boxShadow: `0 4px 20px ${currentColor}55`
          }}
        >
          {user?.displayName?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <h2 className="profile__name">{user?.displayName || 'User'}</h2>
        <p className="profile__joined">
          Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </p>
      </div>

      <div className="profile__stats">
        <div className="profile__stat">
          <span className="profile__stat-value" style={{ color: currentColor }}>{formatDistance(stats.totalDistance)}</span>
          <span className="profile__stat-label">km walked</span>
        </div>
        <div className="profile__stat-divider" />
        <div className="profile__stat">
          <span className="profile__stat-value" style={{ color: currentColor }}>{stats.totalWalks}</span>
          <span className="profile__stat-label">walks</span>
        </div>
        <div className="profile__stat-divider" />
        <div className="profile__stat">
          <span className="profile__stat-value" style={{ color: currentColor }}>{formatTime(stats.totalTime)}</span>
          <span className="profile__stat-label">total time</span>
        </div>
      </div>

      <div className="profile__section">
        <h3 className="profile__section-title">Appearance</h3>
        <div className="profile__colors">
          {COLORS.map((color) => (
            <button
              key={color.value}
              className={`profile__color-btn ${currentColor === color.value ? 'is-active' : ''}`}
              style={{ '--btn-color': color.value }}
              onClick={() => updateColor(color.value)}
              title={color.name}
            >
              <div className="profile__color-dot" style={{ background: color.value }} />
            </button>
          ))}
        </div>
      </div>

      <div className="profile__section">
        <h3 className="profile__section-title">Quick Actions</h3>
        <div className="profile__actions">
          <button className="profile__action" onClick={() => navigate('/start')}>
            <span className="profile__action-icon" style={{ color: currentColor }}>⚡</span>
            <span>Start Walking</span>
          </button>
          <button className="profile__action" onClick={() => navigate('/play')}>
            <span className="profile__action-icon" style={{ color: currentColor }}>🗺️</span>
            <span>View Map</span>
          </button>
          <button className="profile__action" onClick={() => navigate('/feed')}>
            <span className="profile__action-icon" style={{ color: currentColor }}>👥</span>
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
