import { useState, useEffect } from 'react'
import { useAuthContext } from '../context/AuthContext'
import MapView from '../components/MapView'
import TopModeTabs from '../components/TopModeTabs'
import SecondaryTabs from '../components/SecondaryTabs'
import LeaderboardPanel from '../components/LeaderboardPanel'
import HistoryPanel from '../components/HistoryPanel'
import useTerritory from '../hooks/useTerritory'
import PrivateLobbyView from '../components/PrivateLobbyView'
import './PlayPage.css'

export default function PlayPage() {
  const { user } = useAuthContext()
  const { territories } = useTerritory()
  const [mode, setMode] = useState('single')
  const [secondaryTab, setSecondaryTab] = useState('leaderboard')
  const [showPanel, setShowPanel] = useState(false)
  const [userLocation, setUserLocation] = useState(null)

  // Get initial user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        () => {
          // Fallback to Bangalore
          setUserLocation({ lat: 12.9716, lng: 77.5946 })
        },
        { enableHighAccuracy: true, timeout: 5000 }
      )
    } else {
      setUserLocation({ lat: 12.9716, lng: 77.5946 })
    }
  }, [])

  const handleSecondaryTabChange = (tab) => {
    setSecondaryTab(tab)
    setShowPanel(tab === secondaryTab && showPanel ? false : true)
  }

  return (
    <div className="play">
      {/* Full-screen map */}
      <div className="play__map">
        <MapView center={userLocation} path={[]} isTracking={false} territories={territories} />
      </div>

      {mode === 'private' ? (
        <PrivateLobbyView onBack={() => setMode('single')} />
      ) : (
        <>
          {/* Top controls */}
          <div className="play__top">
            <TopModeTabs active={mode} onChange={setMode} />
          </div>



          {/* Sliding panel */}
          {showPanel && (
            <div className="play__panel animate-slide-up">
              {secondaryTab === 'leaderboard' && (
                <LeaderboardPanel currentUser={user?.displayName} />
              )}
              {secondaryTab === 'history' && <HistoryPanel />}
              {secondaryTab === 'events' && (
                <div className="play__panel-empty">
                  <span className="play__panel-empty-icon">📅</span>
                  <p>No events available right now</p>
                  <span className="play__panel-empty-sub">Check back soon!</span>
                </div>
              )}
              {secondaryTab === 'territories' && (
                <div className="play__panel-empty">
                  <span className="play__panel-empty-icon">🗺️</span>
                  <p>Start walking to claim territories</p>
                  <span className="play__panel-empty-sub">Explore your area to unlock zones</span>
                </div>
              )}
            </div>
          )}

          {/* Secondary tabs above bottom bar */}
          <div className="play__secondary">
            <SecondaryTabs active={secondaryTab} onChange={handleSecondaryTabChange} />
          </div>
        </>
      )}
    </div>
  )
}
