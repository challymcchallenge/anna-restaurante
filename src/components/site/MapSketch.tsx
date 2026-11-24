'use client'

import React, { useState } from 'react'

import { UI } from '@/lib/site/strings'

/**
 * Harta de pe Contact (G6-2, D-51): întâi o schiță desenată (fără cereri către terți, fără cookies),
 * cu pinul restaurantului și strada din Setări. Harta Google se încarcă doar la „Arată harta”.
 * Fără JavaScript rămâne schița, iar „Vezi pe hartă” de lângă ea deschide Google Maps.
 */
export function MapSketch({ query, name, street }: { query: string; name: string; street?: string | null }) {
  const [live, setLive] = useState(false)
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=ro&z=16&output=embed`

  return (
    <figure className="map-sketch">
      {live ? (
        <iframe
          className="map-frame"
          src={src}
          title={UI.form.mapTitle(name)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="map-paper">
          <svg className="map-drawing" viewBox="0 0 400 300" aria-hidden="true" focusable="false">
            <g className="map-blocks">
              <path d="M18 22h92v58H18zM128 22h86v44h-86zM232 22h70v66h-70zM320 22h62v52h-62zM18 102h68v74H18zM270 112h112v60H270zM18 200h112v80H18zM150 214h88v66h-88zM258 196h124v84H258z" />
            </g>
            <g className="map-streets">
              <path d="M0 92 C 90 88, 180 96, 400 90" />
              <path d="M0 188 C 120 194, 250 182, 400 186" />
              <path d="M118 0 C 116 90, 122 200, 120 300" />
              <path d="M250 0 C 256 80, 244 200, 250 300" />
            </g>
            <path className="map-main" d="M-10 150 C 100 132, 230 166, 410 140" />
            {street && (
              <text className="map-label" x="22" y="131">
                {street}
              </text>
            )}
            <g className="map-pin" transform="translate(196 146)">
              <circle r="26" className="map-pin-halo" />
              <path d="M0 -22 C 12 -22 20 -13 20 -2 C 20 12 0 30 0 30 C 0 30 -20 12 -20 -2 C -20 -13 -12 -22 0 -22 Z" />
              <circle cy="-3" r="7" className="map-pin-dot" />
            </g>
          </svg>
          <button type="button" className="btn btn-secondary map-show" onClick={() => setLive(true)}>
            {UI.form.showMap}
          </button>
        </div>
      )}
      <figcaption className="map-note">{live ? UI.form.mapLoaded : UI.form.mapNote}</figcaption>
    </figure>
  )
}
