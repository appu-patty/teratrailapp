import { useState } from 'react'
import './PrivateLobbyView.css'

/* ── SVG Icons ── */
const Icons = {
    back: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
    ),
    swords: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="14" y1="16.5" x2="16.5" y2="14"></line>
            <line x1="7.5" y1="10" x2="10" y2="7.5"></line>
            <polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon>
            <line x1="10" y1="16.5" x2="7.5" y2="14"></line>
            <line x1="16.5" y1="10" x2="14" y2="7.5"></line>
            <polygon points="10 2 6 6 17 17 21 17 21 13 10 2"></polygon>
        </svg>
    ),
    join: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    ),
    create: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    ),
    camera: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
        </svg>
    )
}

function ToggleRow({ label, description, checked, onChange }) {
    return (
        <div className="lobby-toggle">
            <div className="lobby-toggle__text">
                <span className="lobby-toggle__label">{label}</span>
                <span className="lobby-toggle__desc">{description}</span>
            </div>
            <button
                className={`lobby-toggle__switch ${checked ? 'lobby-toggle__switch--on' : ''}`}
                onClick={onChange}
                type="button"
            >
                <span className="lobby-toggle__thumb" />
            </button>
        </div>
    )
}

export default function PrivateLobbyView({ onBack }) {
    // 'menu' | 'create' | 'join'
    const [step, setStep] = useState('menu')

    // Create Form State
    const [lobbyName, setLobbyName] = useState('')
    const [settings, setSettings] = useState({
        allowImports: true,
        memberInvites: false,
        inGameChat: true,
        maxSize: false
    })

    // Join Form State
    const [joinCode, setJoinCode] = useState('')

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleCreateSubmit = (e) => {
        e.preventDefault()
        if (!lobbyName.trim()) return
        console.log('Creating lobby:', { lobbyName, settings })
        onBack() // Mock exit to map
    }

    const handleJoinSubmit = (e) => {
        e.preventDefault()
        if (joinCode.length !== 6) return
        console.log('Joining lobby code:', joinCode)
        onBack() // Mock exit to map
    }

    /* ── 1. MENU VIEW (Join vs Create) ── */
    if (step === 'menu') {
        return (
            <div className="private-lobby animate-fade-in">
                <header className="private-lobby__header">
                    <button className="private-lobby__back" onClick={onBack}>
                        {Icons.back}
                    </button>
                    <h1 className="private-lobby__title text-center" style={{ flex: 1, paddingRight: 40 }}>
                        TERRA PRIVATE LOBBIES
                    </h1>
                </header>

                <div className="private-lobby__content">
                    <div className="lobby-menu__hero">
                        <div className="lobby-menu__icon-bg">
                            {Icons.swords}
                        </div>
                        <h2>Private Lobbies</h2>
                        <p>Join or create a private lobby to compete with your friends.</p>
                    </div>

                    <div className="lobby-menu__cards">
                        <button className="lobby-card" onClick={() => setStep('join')}>
                            <div className="lobby-card__icon lobby-card__icon--pink">
                                {Icons.join}
                            </div>
                            <div className="lobby-card__text">
                                <h3>Join a Private Lobby</h3>
                                <p>Enter a 6-digit code to join an existing private lobby.</p>
                            </div>
                        </button>

                        <button className="lobby-card" onClick={() => setStep('create')}>
                            <div className="lobby-card__icon lobby-card__icon--gray">
                                {Icons.create}
                            </div>
                            <div className="lobby-card__text">
                                <h3>Create a Private Lobby</h3>
                                <p>Set up your own private lobby with custom settings.</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    /* ── 2. CREATE LOBBY VIEW ── */
    if (step === 'create') {
        return (
            <div className="private-lobby animate-slide-in-right">
                <header className="private-lobby__header">
                    <button className="private-lobby__back" onClick={() => setStep('menu')}>
                        {Icons.back}
                    </button>
                    <h1 className="private-lobby__title">Create Lobby</h1>
                </header>

                <div className="private-lobby__content private-lobby__content--scrollable">

                    <div className="lobby-section">
                        <h3 className="lobby-section__title">Lobby Details</h3>

                        <div className="lobby-create__photo-upload">
                            <button className="lobby-create__photo-btn">
                                {Icons.camera}
                            </button>
                            <span className="lobby-create__photo-label">
                                Tap to add lobby picture (optional).
                            </span>
                        </div>

                        <div className="lobby-create__input-group">
                            <label>Lobby Name *</label>
                            <input
                                type="text"
                                placeholder="Enter lobby name"
                                value={lobbyName}
                                onChange={(e) => setLobbyName(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="lobby-section">
                        <h3 className="lobby-section__title">Lobby Settings</h3>

                        <div className="lobby-settings-list">
                            <ToggleRow
                                label="Allow Previous Imports"
                                description="Let new members import their existing TerraTrail runs"
                                checked={settings.allowImports}
                                onChange={() => handleToggle('allowImports')}
                            />
                            <ToggleRow
                                label="Member Invitations"
                                description="Allow members to invite others"
                                checked={settings.memberInvites}
                                onChange={() => handleToggle('memberInvites')}
                            />
                            <ToggleRow
                                label="In Game Chat"
                                description="Allow members to chat inside the lobby"
                                checked={settings.inGameChat}
                                onChange={() => handleToggle('inGameChat')}
                            />
                            <ToggleRow
                                label="Maximum Lobby Size"
                                description="Set a maximum number of members in the lobby"
                                checked={settings.maxSize}
                                onChange={() => handleToggle('maxSize')}
                            />
                        </div>
                    </div>

                </div>

                <div className="private-lobby__footer">
                    <button
                        className="lobby-primary-btn"
                        onClick={handleCreateSubmit}
                        disabled={!lobbyName.trim()}
                    >
                        Create Lobby
                    </button>
                </div>
            </div>
        )
    }

    /* ── 3. JOIN LOBBY VIEW ── */
    if (step === 'join') {
        return (
            <div className="private-lobby animate-slide-in-right">
                <header className="private-lobby__header">
                    <button className="private-lobby__back" onClick={() => setStep('menu')}>
                        {Icons.back}
                    </button>
                    <h1 className="private-lobby__title">Join Lobby</h1>
                </header>

                <div className="private-lobby__content">
                    <div className="lobby-section">
                        <h3 className="lobby-section__title">Enter Lobby Code</h3>

                        <div className="lobby-create__input-group">
                            <input
                                type="text"
                                placeholder="6-digit code"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '4px', textTransform: 'uppercase' }}
                                autoFocus
                            />
                        </div>
                    </div>
                </div>

                <div className="private-lobby__footer">
                    <button
                        className="lobby-primary-btn"
                        onClick={handleJoinSubmit}
                        disabled={joinCode.length !== 6}
                    >
                        Join Lobby
                    </button>
                </div>
            </div>
        )
    }

    return null
}
