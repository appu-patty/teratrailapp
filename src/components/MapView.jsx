import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapView.css'

// Dark tile layer from CartoDB
const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'

/* ══════════════════════════════════════════════
   TERRITORY REGIONS — large organic polygons
   covering neighborhoods around Bangalore
   ══════════════════════════════════════════════ */

const TERRITORY_REGIONS = [
  // ── YOUR territory (green) — Cubbon Park + MG Road area ──
  {
    player: 'You',
    color: '#ffb088',
    fillOpacity: 0.22,
    coords: [
      [12.9780, 77.5900], [12.9810, 77.5920], [12.9830, 77.5960],
      [12.9825, 77.6010], [12.9800, 77.6040], [12.9760, 77.6050],
      [12.9720, 77.6030], [12.9690, 77.5990], [12.9680, 77.5950],
      [12.9700, 77.5910], [12.9740, 77.5890],
    ],
  },
  {
    player: 'You',
    color: '#ffb088',
    fillOpacity: 0.18,
    coords: [
      [12.9680, 77.5930], [12.9700, 77.5910], [12.9720, 77.5880],
      [12.9710, 77.5840], [12.9680, 77.5810], [12.9640, 77.5800],
      [12.9610, 77.5830], [12.9600, 77.5870], [12.9620, 77.5910],
      [12.9650, 77.5930],
    ],
  },

  // ── Priya S. (amber/orange) — Rajajinagar / west ──
  {
    player: 'Priya S.',
    color: '#f59e0b',
    fillOpacity: 0.2,
    level: 9, tiles: 42,
    markerPos: [12.9900, 77.5550],
    coords: [
      [12.9950, 77.5480], [12.9980, 77.5520], [12.9990, 77.5580],
      [12.9970, 77.5640], [12.9930, 77.5670], [12.9880, 77.5680],
      [12.9840, 77.5650], [12.9820, 77.5600], [12.9830, 77.5540],
      [12.9860, 77.5490], [12.9900, 77.5470],
    ],
  },

  // ── Arjun K. (red) — Koramangala / south-east ──
  {
    player: 'Arjun K.',
    color: '#ef4444',
    fillOpacity: 0.18,
    level: 6, tiles: 28,
    markerPos: [12.9350, 77.6150],
    coords: [
      [12.9420, 77.6080], [12.9440, 77.6130], [12.9430, 77.6200],
      [12.9390, 77.6250], [12.9330, 77.6260], [12.9280, 77.6230],
      [12.9260, 77.6170], [12.9270, 77.6110], [12.9310, 77.6070],
      [12.9370, 77.6060],
    ],
  },

  // ── Sneha M. (purple) — Indiranagar / east ──
  {
    player: 'Sneha M.',
    color: '#a78bfa',
    fillOpacity: 0.2,
    level: 11, tiles: 55,
    markerPos: [12.9720, 77.6400],
    coords: [
      [12.9780, 77.6300], [12.9810, 77.6350], [12.9800, 77.6430],
      [12.9770, 77.6490], [12.9720, 77.6510], [12.9670, 77.6500],
      [12.9640, 77.6450], [12.9630, 77.6380], [12.9660, 77.6320],
      [12.9710, 77.6290],
    ],
  },

  // ── Ravi D. (blue) — Basavanagudi / south-west ──
  {
    player: 'Ravi D.',
    color: '#3b82f6',
    fillOpacity: 0.18,
    level: 7, tiles: 33,
    markerPos: [12.9420, 77.5700],
    coords: [
      [12.9500, 77.5640], [12.9520, 77.5690], [12.9510, 77.5760],
      [12.9470, 77.5800], [12.9420, 77.5810], [12.9370, 77.5790],
      [12.9350, 77.5730], [12.9360, 77.5670], [12.9400, 77.5630],
      [12.9450, 77.5620],
    ],
  },

  // ── Kira T. (pink) — Malleshwaram / north-west ──
  {
    player: 'Kira T.',
    color: '#ec4899',
    fillOpacity: 0.18,
    level: 4, tiles: 19,
    markerPos: [12.9970, 77.5720],
    coords: [
      [13.0010, 77.5660], [13.0040, 77.5700], [13.0030, 77.5770],
      [12.9990, 77.5810], [12.9940, 77.5800], [12.9920, 77.5750],
      [12.9930, 77.5690], [12.9960, 77.5650],
    ],
  },

  // ── Deepak R. (teal) — Jayanagar / south ──
  {
    player: 'Deepak R.',
    color: '#14b8a6',
    fillOpacity: 0.16,
    level: 8, tiles: 38,
    markerPos: [12.9250, 77.5830],
    coords: [
      [12.9310, 77.5770], [12.9330, 77.5820], [12.9320, 77.5890],
      [12.9280, 77.5920], [12.9230, 77.5930], [12.9190, 77.5900],
      [12.9180, 77.5840], [12.9200, 77.5780], [12.9240, 77.5750],
    ],
  },

  // ── Meera V. (amber-red) — Whitefield / far east ──
  {
    player: 'Meera V.',
    color: '#f97316',
    fillOpacity: 0.2,
    level: 13, tiles: 72,
    markerPos: [12.9700, 77.7500],
    coords: [
      [12.9800, 77.7380], [12.9840, 77.7450], [12.9830, 77.7550],
      [12.9780, 77.7620], [12.9710, 77.7640], [12.9640, 77.7610],
      [12.9610, 77.7530], [12.9620, 77.7440], [12.9670, 77.7380],
      [12.9730, 77.7360],
    ],
  },

  // ── Vikram J. (green-yellow) — Electronic City / far south ──
  {
    player: 'Vikram J.',
    color: '#84cc16',
    fillOpacity: 0.16,
    level: 5, tiles: 24,
    markerPos: [12.8450, 77.6600],
    coords: [
      [12.8530, 77.6520], [12.8560, 77.6580], [12.8550, 77.6660],
      [12.8500, 77.6700], [12.8440, 77.6710], [12.8390, 77.6680],
      [12.8380, 77.6610], [12.8400, 77.6550], [12.8450, 77.6510],
    ],
  },

  // ── Ananya P. (sky blue) — Hebbal / north ──
  {
    player: 'Ananya P.',
    color: '#38bdf8',
    fillOpacity: 0.18,
    level: 10, tiles: 48,
    markerPos: [13.0350, 77.5900],
    coords: [
      [13.0410, 77.5830], [13.0440, 77.5880], [13.0430, 77.5960],
      [13.0390, 77.6000], [13.0330, 77.6010], [13.0290, 77.5980],
      [13.0280, 77.5910], [13.0300, 77.5850], [13.0350, 77.5820],
    ],
  },
]

export default function MapView({
  path = [],
  center,
  isTracking,
  territories = {},
  sessionTiles = [],
  className = '',
}) {
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
      zoom: 13,
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

    // ── Render territory regions ──
    TERRITORY_REGIONS.forEach((region) => {
      // Draw the polygon
      L.polygon(region.coords, {
        color: region.color,
        weight: 1.5,
        opacity: 0.5,
        fillColor: region.color,
        fillOpacity: region.fillOpacity,
        smoothFactor: 2,
        className: 'territory-region',
      }).addTo(map)

      // Player marker (skip "You" — handled by user marker)
      if (region.player !== 'You' && region.markerPos) {
        const icon = L.divIcon({
          className: 'player-marker-wrapper',
          html: `
            <div class="player-marker" style="--player-color: ${region.color}">
              <div class="player-marker__dot"></div>
              <div class="player-marker__pulse"></div>
            </div>
            <div class="player-marker__label" style="--player-color: ${region.color}">
              <span class="player-marker__name">${region.player}</span>
              <span class="player-marker__stats">Lv${region.level} · ${region.tiles} tiles</span>
            </div>
          `,
          iconSize: [100, 50],
          iconAnchor: [50, 20],
        })
        L.marker(region.markerPos, { icon, interactive: false }).addTo(map)
      }
    })

    // Glow polyline (wider, transparent)
    glowPolylineRef.current = L.polyline([], {
      color: '#ffb088',
      weight: 12,
      opacity: 0.2,
      smoothFactor: 1,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map)

    // Main path polyline
    polylineRef.current = L.polyline([], {
      color: '#ffb088',
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
        html: '<div class="user-marker"><div class="user-marker__ring"></div></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })
      markerRef.current = L.marker([center.lat, center.lng], { icon }).addTo(map)
    } else {
      markerRef.current.setLatLng([center.lat, center.lng])
    }
  }, [center, isTracking])

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
