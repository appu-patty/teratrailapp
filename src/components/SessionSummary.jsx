import MetricsPanel from './MetricsPanel'
import ActionButton from './ActionButton'
import './SessionSummary.css'

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function formatDistance(meters) {
  return (meters / 1000).toFixed(2)
}

export default function SessionSummary({ distance, elapsed, newTiles = 0, totalTerritories = 0, onNewWalk }) {
  return (
    <div className="session-summary">
      <div className="session-summary__backdrop" />
      <div className="session-summary__card">
        <div className="session-summary__header">
          <div className="session-summary__check">✓</div>
          <h2 className="session-summary__title">Session Complete</h2>
          <p className="session-summary__subtitle">Great effort! Here's your summary.</p>
        </div>

        <div className="session-summary__stats">
          <div className="session-summary__stat">
            <span className="session-summary__stat-value">{formatDistance(distance)}</span>
            <span className="session-summary__stat-label">kilometers</span>
          </div>
          <div className="session-summary__stat-divider" />
          <div className="session-summary__stat">
            <span className="session-summary__stat-value">{formatTime(elapsed)}</span>
            <span className="session-summary__stat-label">duration</span>
          </div>
        </div>

        {/* Territory capture results */}
        {newTiles > 0 && (
          <div className="session-summary__territory">
            <div className="session-summary__territory-badge">
              <span className="session-summary__territory-icon">🗺️</span>
              <div className="session-summary__territory-info">
                <span className="session-summary__territory-new">+{newTiles} new tiles captured!</span>
                <span className="session-summary__territory-total">{totalTerritories} total territories</span>
              </div>
            </div>
          </div>
        )}

        <ActionButton variant="newWalk" onClick={onNewWalk} />
      </div>
    </div>
  )
}
