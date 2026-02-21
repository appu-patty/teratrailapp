import { useState, useCallback, useRef } from 'react'

const TERRITORIES_KEY = 'terratrail_territories'
const GRID_PRECISION = 3 // ~111m per unit at equator → ~100m tiles

/**
 * Snap a coordinate to the grid.
 * Precision 3 = 0.001° ≈ 111m lat, ~100m lng at mid-latitudes
 */
function snapToGrid(lat, lng) {
    const snapLat = Number(lat.toFixed(GRID_PRECISION))
    const snapLng = Number(lng.toFixed(GRID_PRECISION))
    return { snapLat, snapLng, key: `${snapLat}_${snapLng}` }
}

/**
 * Convert a tile key back to a bounding box for map rendering.
 * Returns { south, west, north, east }
 */
export function tileBounds(key) {
    const [lat, lng] = key.split('_').map(Number)
    const step = Math.pow(10, -GRID_PRECISION) // 0.001
    return {
        south: lat,
        west: lng,
        north: lat + step,
        east: lng + step,
    }
}

/**
 * Generate dummy territory tiles around a center point
 * simulating walking paths through a neighborhood
 */
function generateDummyTerritories() {
    const tiles = {}
    const centerLat = 12.9716
    const centerLng = 77.5946
    const step = 0.001

    // Path 1: A walk going north along a main road
    for (let i = 0; i < 15; i++) {
        const key = `${(centerLat + i * step).toFixed(3)}_${centerLng.toFixed(3)}`
        tiles[key] = { capturedAt: Date.now() - 86400000 } // yesterday
    }

    // Path 2: East-west road from center
    for (let i = -8; i < 12; i++) {
        const key = `${centerLat.toFixed(3)}_${(centerLng + i * step).toFixed(3)}`
        tiles[key] = { capturedAt: Date.now() - 172800000 } // 2 days ago
    }

    // Path 3: Diagonal walk (NE)
    for (let i = 0; i < 10; i++) {
        const key = `${(centerLat + i * step).toFixed(3)}_${(centerLng + i * step).toFixed(3)}`
        tiles[key] = { capturedAt: Date.now() - 43200000 } // 12 hours ago
    }

    // Path 4: Loop around a park (Cubbon Park area)
    const parkLat = 12.976
    const parkLng = 77.592
    const loopPoints = [
        [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 5], [2, 5], [3, 5], [4, 5],
        [4, 4], [4, 3], [4, 2], [4, 1], [4, 0],
        [3, 0], [2, 0], [1, 0],
        // Fill inside a bit
        [1, 1], [1, 2], [2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [3, 3], [3, 4], [1, 3], [1, 4], [2, 4],
    ]
    for (const [dLat, dLng] of loopPoints) {
        const key = `${(parkLat + dLat * step).toFixed(3)}_${(parkLng + dLng * step).toFixed(3)}`
        tiles[key] = { capturedAt: Date.now() - 7200000 } // 2 hours ago
    }

    // Path 5: Southern exploration
    for (let i = 0; i < 8; i++) {
        const lat = (centerLat - i * step).toFixed(3)
        const lng = (centerLng + 2 * step).toFixed(3)
        tiles[`${lat}_${lng}`] = { capturedAt: Date.now() - 3600000 }
        // Widen the path
        const lng2 = (centerLng + 3 * step).toFixed(3)
        tiles[`${lat}_${lng2}`] = { capturedAt: Date.now() - 3600000 }
    }

    return tiles
}

function loadFromStorage() {
    try {
        const stored = JSON.parse(localStorage.getItem(TERRITORIES_KEY))
        if (stored && Object.keys(stored).length > 0) {
            return stored
        }
        // Seed with dummy data if empty
        const dummy = generateDummyTerritories()
        saveToStorage(dummy)
        return dummy
    } catch {
        const dummy = generateDummyTerritories()
        saveToStorage(dummy)
        return dummy
    }
}

function saveToStorage(tiles) {
    localStorage.setItem(TERRITORIES_KEY, JSON.stringify(tiles))
}

/**
 * useTerritory — grid-based territory capture system
 *
 * Returns:
 *  - territories: object of all captured tile keys
 *  - sessionTiles: array of tile keys captured this session
 *  - totalCount: total captured tiles
 *  - sessionCount: tiles captured this session
 *  - captureTile(lat, lng): capture a tile, returns { isNew, key }
 *  - resetSession(): clear session tiles for a new walk
 */
export default function useTerritory() {
    const [territories, setTerritories] = useState(() => loadFromStorage())
    const [sessionTiles, setSessionTiles] = useState([])
    const territoriesRef = useRef(territories)

    // Keep ref in sync for use inside callbacks
    territoriesRef.current = territories

    const captureTile = useCallback((lat, lng) => {
        const { key } = snapToGrid(lat, lng)

        if (territoriesRef.current[key]) {
            return { isNew: false, key }
        }

        const updated = {
            ...territoriesRef.current,
            [key]: { capturedAt: Date.now() },
        }
        territoriesRef.current = updated
        setTerritories(updated)
        saveToStorage(updated)
        setSessionTiles((prev) => [...prev, key])

        return { isNew: true, key }
    }, [])

    const resetSession = useCallback(() => {
        setSessionTiles([])
    }, [])

    return {
        territories,
        sessionTiles,
        totalCount: Object.keys(territories).length,
        sessionCount: sessionTiles.length,
        captureTile,
        resetSession,
        tileBounds,
    }
}
