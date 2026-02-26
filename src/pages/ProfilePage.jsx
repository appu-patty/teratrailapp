import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import useTerritory from '../hooks/useTerritory'
import './ProfilePage.css'

/* ── SVG Icon Components ── */
const Icons = {
  routes: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" />
    </svg>
  ),
  xp: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  challenges: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  competitions: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  battles: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  achievements: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  edit: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  ),
  shield: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  distance: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 7 17l-5-5" /><path d="m22 10-7.5 7.5L13 16" />
    </svg>
  ),
  clock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  map: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 7 6-3 6 3 6-3v13l-6 3-6-3-6 3Z" /><path d="M9 4v13" /><path d="M15 7v13" />
    </svg>
  ),
  flame: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),
  chevron: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
}

/* ── Mock Data ── */
const MOCK_XP = { current: 1250, nextLevel: 2000, level: 7 }

const MOCK_CHALLENGES = [
  { id: 1, title: 'Walk 3 km today', subtitle: 'Daily Challenge', progress: 0.65, icon: '🚶' },
  { id: 2, title: 'Explore a new area', subtitle: 'Discovery', progress: 0.2, icon: '🧭' },
  { id: 3, title: '7-day streak', subtitle: 'Consistency', progress: 0.85, icon: '🔥' },
]

const MOCK_COMPETITIONS = [
  { id: 1, title: 'City Sprint Challenge', location: 'Bangalore Central', rank: 12, participants: 148, active: true },
  { id: 2, title: 'Weekend Warriors', location: 'Cubbon Park', rank: 5, participants: 42, active: true },
]

const MOCK_RECENT_ROUTES = [
  { id: 1, date: 'Today', distance: '2.4 km', duration: '28 min', color: '#ffb088' },
  { id: 2, date: 'Yesterday', distance: '3.1 km', duration: '35 min', color: '#3b82f6' },
  { id: 3, date: 'Feb 19', distance: '1.8 km', duration: '22 min', color: '#a78bfa' },
]

const ACTION_CARDS = [
  { key: 'routes', icon: Icons.routes, title: 'My Routes', subtitle: 'Past walks & runs', color: '#ffb088' },
  { key: 'xp', icon: Icons.xp, title: 'XP & Levels', subtitle: 'Progress breakdown', color: '#f5c542' },
  { key: 'challenges', icon: Icons.challenges, title: 'Challenges', subtitle: 'Daily & weekly goals', color: '#fb923c' },
  { key: 'competitions', icon: Icons.competitions, title: 'Competitions', subtitle: 'Compete with others', color: '#3b82f6' },
  { key: 'battles', icon: Icons.battles, title: 'Local Battles', subtitle: 'Area-based contests', color: '#a78bfa' },
  { key: 'achievements', icon: Icons.achievements, title: 'Achievements', subtitle: 'Badges & milestones', color: '#f87171' },
]

/* ── Progress Ring Component ── */
function ProgressRing({ progress, size = 44, strokeWidth = 3.5 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)

  return (
    <svg className="progress-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />
      <circle
        className="progress-ring__fill"
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="url(#progressGrad)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <defs>
        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb088" />
          <stop offset="100%" stopColor="#ff9a76" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* ── Main Profile Page ── */
export default function ProfilePage() {
  const { user, logout } = useAuthContext()
  const navigate = useNavigate()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { totalCount: territoryCount } = useTerritory()

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

  const xpPercent = (MOCK_XP.current / MOCK_XP.nextLevel) * 100

  return (
    <div className="profile">

      {/* ── 1. PROFILE HEADER ── */}
      <section className="profile__header">
        <div className="profile__header-bg" />
        <div className="profile__avatar-ring">
          <div className="profile__avatar">
            {user?.displayName?.charAt(0)?.toUpperCase() || '?'}
          </div>
        </div>
        <h2 className="profile__name">{user?.displayName || 'Explorer'}</h2>
        <p className="profile__tagline">
          Explorer since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>

        {/* XP Bar */}
        <div className="profile__xp">
          <div className="profile__xp-info">
            <span className="profile__xp-level">Level {MOCK_XP.level}</span>
            <span className="profile__xp-count">{MOCK_XP.current} / {MOCK_XP.nextLevel} XP</span>
          </div>
          <div className="profile__xp-bar">
            <div className="profile__xp-fill" style={{ width: `${xpPercent}%` }} />
          </div>
        </div>
      </section>

      {/* ── 2. QUICK STATS ── */}
      <section className="profile__stats">
        <div className="profile__stat">
          <span className="profile__stat-icon">{Icons.distance}</span>
          <span className="profile__stat-value">{formatDistance(stats.totalDistance)}</span>
          <span className="profile__stat-label">km</span>
        </div>
        <div className="profile__stat">
          <span className="profile__stat-icon">{Icons.clock}</span>
          <span className="profile__stat-value">{formatTime(stats.totalTime)}</span>
          <span className="profile__stat-label">time</span>
        </div>
        <div className="profile__stat">
          <span className="profile__stat-icon">{Icons.map}</span>
          <span className="profile__stat-value">{stats.totalWalks}</span>
          <span className="profile__stat-label">routes</span>
        </div>
        <div className="profile__stat">
          <span className="profile__stat-icon">{Icons.flame}</span>
          <span className="profile__stat-value">{territoryCount}</span>
          <span className="profile__stat-label">tiles</span>
        </div>
      </section>

      {/* ── 3. ACTION GRID ── */}
      <section className="profile__section">
        <h3 className="profile__section-title">Explore</h3>
        <div className="profile__grid">
          {ACTION_CARDS.map((card) => (
            <button key={card.key} className="profile__card" style={{ '--card-accent': card.color }}>
              <span className="profile__card-icon">{card.icon}</span>
              <div className="profile__card-text">
                <span className="profile__card-title">{card.title}</span>
                <span className="profile__card-subtitle">{card.subtitle}</span>
              </div>
              <span className="profile__card-arrow">{Icons.chevron}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── 4. ACTIVE CHALLENGES ── */}
      <section className="profile__section">
        <div className="profile__section-header">
          <h3 className="profile__section-title">Active Challenges</h3>
          <button className="profile__section-link">View all</button>
        </div>
        <div className="profile__challenges">
          {MOCK_CHALLENGES.map((c) => (
            <div key={c.id} className="profile__challenge">
              <ProgressRing progress={c.progress} />
              <div className="profile__challenge-info">
                <span className="profile__challenge-title">{c.title}</span>
                <span className="profile__challenge-subtitle">{c.subtitle}</span>
              </div>
              <span className="profile__challenge-percent">
                {Math.round(c.progress * 100)}%
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. COMPETITIONS ── */}
      <section className="profile__section">
        <div className="profile__section-header">
          <h3 className="profile__section-title">Competitions</h3>
          <button className="profile__section-link">See all</button>
        </div>
        <div className="profile__competitions">
          {MOCK_COMPETITIONS.map((comp) => (
            <div key={comp.id} className="profile__competition">
              <div className="profile__competition-top">
                <span className="profile__competition-badge">LIVE</span>
                <span className="profile__competition-rank">#{comp.rank}</span>
              </div>
              <h4 className="profile__competition-title">{comp.title}</h4>
              <p className="profile__competition-location">📍 {comp.location}</p>
              <div className="profile__competition-footer">
                <span className="profile__competition-participants">
                  {comp.participants} walkers
                </span>
                <button className="profile__competition-btn">View Leaderboard</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. RECENT ROUTES ── */}
      <section className="profile__section">
        <div className="profile__section-header">
          <h3 className="profile__section-title">Recent Routes</h3>
          <button className="profile__section-link">View all</button>
        </div>
        <div className="profile__routes">
          {MOCK_RECENT_ROUTES.map((route) => (
            <div key={route.id} className="profile__route">
              <div className="profile__route-map" style={{ '--route-color': route.color }}>
                <svg viewBox="0 0 80 50" className="profile__route-path">
                  <path
                    d={route.id === 1 ? "M5 40 Q20 10 40 25 T75 10" :
                      route.id === 2 ? "M5 30 Q25 5 45 30 T75 15" :
                        "M5 35 Q30 15 50 35 T75 20"}
                    fill="none" stroke={route.color} strokeWidth="2.5" strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="profile__route-info">
                <span className="profile__route-date">{route.date}</span>
                <span className="profile__route-stats">{route.distance} · {route.duration}</span>
              </div>
              <button className="profile__route-action">
                {Icons.chevron}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. SETTINGS ── */}
      <section className="profile__section profile__settings-section">
        <h3 className="profile__section-title">Account</h3>
        <div className="profile__settings">
          <button className="profile__setting">
            <span className="profile__setting-icon">{Icons.edit}</span>
            <span>Edit Profile</span>
            <span className="profile__setting-arrow">{Icons.chevron}</span>
          </button>
          <button className="profile__setting">
            <span className="profile__setting-icon">{Icons.shield}</span>
            <span>Privacy Controls</span>
            <span className="profile__setting-arrow">{Icons.chevron}</span>
          </button>
          <button className="profile__setting">
            <span className="profile__setting-icon">{Icons.settings}</span>
            <span>Preferences</span>
            <span className="profile__setting-arrow">{Icons.chevron}</span>
          </button>
          <button className="profile__setting profile__setting--danger" onClick={handleLogout}>
            <span className="profile__setting-icon">{Icons.logout}</span>
            <span>Sign Out</span>
          </button>
        </div>
      </section>

      {/* Bottom safe area spacer */}
      <div className="profile__spacer" />
    </div>
  )
}
