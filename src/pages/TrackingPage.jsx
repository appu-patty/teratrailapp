import { useMemo } from 'react'
import useTracker from '../hooks/useTracker'
import { useAuthContext } from '../context/AuthContext'
import MapView from '../components/MapView'
import MetricsPanel from '../components/MetricsPanel'
import ActionButton from '../components/ActionButton'
import SessionSummary from '../components/SessionSummary'
import './TrackingPage.css'

export default function TrackingPage() {
  const { updateStats } = useAuthContext()
  const {
    status,
    path,
    distance,
    elapsed,
    position,
    error,
    permissionState,
    start,
    stop,
    reset,
  } = useTracker()

  const center = useMemo(() => {
    if (position) return { lat: position.lat, lng: position.lng }
    return null
  }, [position])

  const handleStop = () => {
    stop()
    // Save stats to user profile
    if (distance > 0 || elapsed > 0) {
      updateStats(distance, elapsed)
    }
  }

  const handleNewWalk = () => {
    reset()
  }

  return (
    <div className="tracking">
      {/* Map fills the background */}
      <div className="tracking__map">
        <MapView
          path={path}
          center={center}
          isTracking={status === 'tracking'}
        />
      </div>

      {/* Top bar - branding */}
      <header className="tracking__header">
        <span className="tracking__logo">
          <span className="tracking__logo-accent">Terra</span>Trail
        </span>
        {status === 'tracking' && (
          <div className="tracking__live-badge">
            <span className="tracking__live-dot" />
            LIVE
          </div>
        )}
      </header>

      {/* Bottom controls */}
      <div className="tracking__controls">
        {/* Error state */}
        {error && permissionState === 'denied' && (
          <div className="tracking__error animate-fade-in">
            <div className="tracking__error-icon">📍</div>
            <p className="tracking__error-title">Location access needed</p>
            <p className="tracking__error-desc">
              Please enable location permissions in your browser settings to start tracking.
            </p>
          </div>
        )}

        {/* Metrics - visible when tracking */}
        {status === 'tracking' && (
          <MetricsPanel
            distance={distance}
            elapsed={elapsed}
            className="animate-fade-in"
          />
        )}

        {/* Idle state hint */}
        {status === 'idle' && !error && (
          <p className="tracking__hint animate-fade-in">
            Tap below to start your walk
          </p>
        )}

        {/* Action button */}
        {status === 'idle' && (
          <ActionButton
            variant="start"
            onClick={start}
            disabled={permissionState === 'denied'}
          />
        )}

        {status === 'tracking' && (
          <ActionButton variant="stop" onClick={handleStop} />
        )}
      </div>

      {/* Session summary overlay */}
      {status === 'summary' && (
        <SessionSummary
          distance={distance}
          elapsed={elapsed}
          onNewWalk={handleNewWalk}
        />
      )}
    </div>
  )
}
