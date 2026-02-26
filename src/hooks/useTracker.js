import { useState, useRef, useCallback, useEffect } from 'react'
import useGeolocation from './useGeolocation'
import useTerritory from './useTerritory'

// Haversine distance in meters
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function useTracker() {
  const { position, error, permissionState, startWatching, stopWatching } =
    useGeolocation()
  const territory = useTerritory()

  // Session state: 'idle' | 'tracking' | 'summary'
  const [status, setStatus] = useState('idle')
  const [path, setPath] = useState([])
  const [distance, setDistance] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)
  const lastPosRef = useRef(null)

  // GPS noise filter: minimum distance in meters to register a new point
  const MIN_MOVE = 3

  // Track position updates during an active session
  useEffect(() => {
    if (status !== 'tracking' || !position) return

    const { lat, lng } = position

    if (lastPosRef.current) {
      const d = haversine(lastPosRef.current.lat, lastPosRef.current.lng, lat, lng)
      if (d < MIN_MOVE) return // ignore GPS jitter
      setDistance((prev) => prev + d)
    }

    lastPosRef.current = { lat, lng }
    setPath((prev) => [...prev, [lng, lat]]) // Leaflet uses [lng, lat] in path

    // Capture territory tile at this position
    territory.captureTile(lat, lng)
  }, [position, status])

  // Timer
  useEffect(() => {
    if (status === 'tracking') {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [status])

  const start = useCallback(() => {
    setPath([])
    setDistance(0)
    setElapsed(0)
    lastPosRef.current = null
    territory.resetSession()
    startWatching()
    setStatus('tracking')
  }, [startWatching, territory])

  const stop = useCallback(() => {
    stopWatching()
    setStatus('summary')
  }, [stopWatching])

  const reset = useCallback(() => {
    setPath([])
    setDistance(0)
    setElapsed(0)
    lastPosRef.current = null
    setStatus('idle')
  }, [])

  return {
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
    // Territory data
    territories: territory.territories,
    sessionTiles: territory.sessionTiles,
    totalTerritories: territory.totalCount,
    newTilesCaptured: territory.sessionCount,
  }
}
