import './GlobePreview.css'

export default function GlobePreview({ onClick }) {
  return (
    <div className="globe-preview" onClick={onClick} title="Expand map">
      <div className="globe-preview__sphere">
        {/* Earth texture – animates to simulate rotation */}
        <div className="globe-preview__texture" />
        {/* 3D shading overlay */}
        <div className="globe-preview__shading" />
        {/* Specular highlight */}
        <div className="globe-preview__highlight" />
      </div>
      {/* Expand badge */}
      <div className="globe-preview__expand">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </div>
    </div>
  )
}
