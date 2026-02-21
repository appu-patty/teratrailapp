import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapView.css'

// Dark tile layer from CartoDB
const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'

export default function MapView({ path = [], center, isTracking, themeColor = '#4aedc4', className = '' }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const polylineRef = useRef(null)
  const glowPolylineRef = useRef(null)
  const markerRef = useRef(null)

  // Initialize map
  useEffect(() => {
    if (mapRef.current) return

    const map = L.map(containerRef.current, {
      center: center ? [center.lat, center.lng] : [12.9716, 77.5946],
      zoom: 15,
      zoomControl: false,
      attributionControl: true,
    })

    L.tileLayer(DARK_TILES, {
      attribution: TILE_ATTR,
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map)

    // Zoom control on the right
    L.control.zoom({ position: 'topright' }).addTo(map)

    // Glow polyline (wider, transparent)
    glowPolylineRef.current = L.polyline([], {
      color: themeColor,
      weight: 12,
      opacity: 0.2,
      smoothFactor: 1,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map)

    // Main path polyline
    polylineRef.current = L.polyline([], {
      color: themeColor,
      weight: 4,
      opacity: 0.9,
      smoothFactor: 1,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map)

    mapRef.current = map

    // Force a resize after mount
    setTimeout(() => map.invalidateSize(), 100)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Update path
  useEffect(() => {
    if (!polylineRef.current || !glowPolylineRef.current) return

    // Convert from [lng,lat] to [lat,lng] for Leaflet
    const latLngs = path.map(([lng, lat]) => [lat, lng])
    polylineRef.current.setLatLngs(latLngs)
    glowPolylineRef.current.setLatLngs(latLngs)
  }, [path])

  // Update polyline colors when themeColor changes
  useEffect(() => {
    if (!polylineRef.current || !glowPolylineRef.current) return
    polylineRef.current.setStyle({ color: themeColor })
    glowPolylineRef.current.setStyle({ color: themeColor })
  }, [themeColor])

  // Update center + marker
  useEffect(() => {
    const map = mapRef.current
    if (!map || !center) return

    if (isTracking) {
      map.setView([center.lat, center.lng], map.getZoom(), { animate: true, duration: 0.8 })
    }

    if (!markerRef.current) {
      const icon = L.divIcon({
        className: 'user-marker-wrapper',
        html: `
          <div class="user-marker" style="background: ${themeColor}; box-shadow: 0 0 12px ${themeColor}66, 0 0 24px ${themeColor}33">
            <div class="user-marker__ring" style="background: ${themeColor}26"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })
      markerRef.current = L.marker([center.lat, center.lng], { icon }).addTo(map)
    } else {
      // Re-create icon if themeColor changes
      const icon = L.divIcon({
        className: 'user-marker-wrapper',
        html: `
          <div class="user-marker" style="background: ${themeColor}; box-shadow: 0 0 12px ${themeColor}66, 0 0 24px ${themeColor}33">
            <div class="user-marker__ring" style="background: ${themeColor}26"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })
      markerRef.current.setIcon(icon)
      markerRef.current.setLatLng([center.lat, center.lng])
    }
  }, [center, isTracking, themeColor])

  // Resize handler
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const handleResize = () => map.invalidateSize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <div ref={containerRef} className={`map-container ${className}`} />
}
