import React, { useEffect, useRef } from 'react'
import styles from './style.module.css'

interface SearchBarProps {
  value: string
  onChange: (val: string) => void
  onSearchClick: () => void
  map: google.maps.Map | null
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearchClick, map }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!map || !inputRef.current || !window.google?.maps?.places) return

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current!, {
      types: ['geocode'],
    })

    autocomplete.bindTo('bounds', map)

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.geometry || !place.geometry.location) return

      map.panTo(place.geometry.location)
      map.setZoom(15)
    })
  }, [map])

  // 🧠 Add dropdown style for .pac-container
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      .pac-container {
        width: 400px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        margin-top: -1px !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      }
    `
    document.head.appendChild(style)
  }, [])


  // 🆕 Manual search handler
  const handleManualSearch = () => {
    if (!map || !value.trim()) return

    const service = new window.google.maps.places.PlacesService(map)

    service.findPlaceFromQuery(
      {
        query: value,
        fields: ['geometry'],
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0].geometry?.location) {
          map.panTo(results[0].geometry.location)
          map.setZoom(15)
        }
      }
    )
  }

  return (
    <div className={styles.container}>
      <input
        ref={inputRef}
        id="polygon-label"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault() // prevent form submission if inside a form
            handleManualSearch()
          }
        }}
        placeholder="Search Google Maps"
        className={styles.input}
      />
      <button className={styles.button} onClick={handleManualSearch}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          viewBox="0 0 24 24"
          width="20"
          fill="#70757a"
        >
          <path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-5.34C15.2 5.01 12.19 2 8.6 2S2 5.01 2 8.6s3.01 6.6 6.6 6.6c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5L20.49 19l-5-5zm-6.9 0C6.01 14 4 11.99 4 9.6S6.01 5.2 8.6 5.2 13.2 7.21 13.2 9.6 11.19 14 8.6 14z" />
        </svg>
      </button>
    </div>
  )
}
