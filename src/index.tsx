import {GoogleMap as GoogleApiMap, InfoWindow, useJsApiLoader} from '@react-google-maps/api'
import React, {useMemo, useState, useCallback, type FC} from 'react'
import {Retool} from '@tryretool/custom-component-support'
import {Toggle} from './common/Toggle'
import {Sidebar} from './common/Sidebar'
import {usePolygon} from './common/hooks'
import {Polygon, SelectedPolygon} from './common/type'
import { SearchBar } from './common/SearchBar'
import styles from './common/style.module.css'

export const GoogleMap: FC = () => {
  Retool.useComponentSettings({defaultHeight: 25, defaultWidth: 5})
  const onAdd = Retool.useEventCallback({ name: "add" })
  const onRemove = Retool.useEventCallback({ name: "remove" })
  const [polygonLabel, setPolygonLabel] = useState('')


  const [serializablePolygons] = Retool.useStateArray({
    name: 'polygons',
    inspector: 'text', 
    label: 'Polygons',
  })

  const [_newPolygon, setNewPolygon] = Retool.useStateObject({
    name: 'new_polygon',
    inspector: 'hidden', 
    label: 'New polygon',
  })

  const [_polygonId, setRemovePolygonId] = Retool.useStateString({
    name: 'remove_polygon_id',
    inspector: 'hidden', 
    label: 'Remove polygon Id',
  })

  const [googleMapsApiKey] = Retool.useStateString({
    name: 'google_maps_api_key',
    inspector: 'text', 
    label: 'googleMapsApiKey',
  })

  const polygons = serializablePolygons as Polygon[]
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isPolygon, setIsPolygon] = useState<boolean>(false)
  const [selectedPolygon, setSelectedPolygon] = useState<SelectedPolygon | null>(null)

  const {isDrawing, clearPolygon, getPolygon} = usePolygon({
    map,
    polygons,
    isPolygon,
    onClickPolygon: (polygon) => setSelectedPolygon(polygon),
  })

  // FIXME: Need to find another way to pass googleMapsApiKey. 
  // In the current implementation, the map requires a page refresh after entering googleMapsApiKey.
  const {isLoaded} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey,
    libraries:  ['geometry', 'drawing', 'places'],
  })

  const mapOptions: google.maps.MapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      minZoom: 3,
      restriction: {latLngBounds: {north: 85, south: -85, west: -169, east: 190}, strictBounds: true},
    }),
    [],
  )

  const position = useMemo(() => ({lat: 48, lng: 11}), [])
  
  const addPolygon = useCallback(() => {
    const newPolygon = getPolygon()

    if (!newPolygon) {
      return
    }

    setNewPolygon(newPolygon)
    clearPolygon()
    onAdd()
  }, [clearPolygon, getPolygon, polygons])

  const removePolygon = useCallback((id: string) => {
    setRemovePolygonId(id)
    setSelectedPolygon(null)
    onRemove()
  }, [])

  return (
    <div style={{position: "relative", width: "100%", height: "100%"}}>
      <Sidebar>
        <div className={styles.item}>
          <p>Polygon editor</p>
          <Toggle isChecked={isPolygon} toggle={() => setIsPolygon(!isPolygon)}/>
        </div>
      </Sidebar>

    <SearchBar
      value={polygonLabel}
      onChange={setPolygonLabel}
      onSearchClick={() => console.log('Manual search:', polygonLabel)}
      map={map}
    />

      
      {isDrawing && (
        <button className={styles.add} type="button" onClick={addPolygon}>
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M10.0002 3.33325V16.6666M16.6668 9.99992H3.3335" 
              stroke="#FFFFFF" 
              strokeWidth="1.5" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {isLoaded && (
        <GoogleApiMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          zoom={5}
          options={mapOptions}
          center={position}
          onLoad={(mapInstance) => setMap(mapInstance)}
          >
          {selectedPolygon && (
            <InfoWindow
              position={{lat: selectedPolygon.topPoint.lat!, lng: selectedPolygon.topPoint.lng!}}
              options={{minWidth: 320, maxWidth: 320}}
              onCloseClick={() => setSelectedPolygon(null)}
            >
              <div style={{display: 'grid', gap: '12px'}}>
                <div>Id: <b>{selectedPolygon.polygon.id}</b></div>

                {isPolygon && (
                  <button 
                    className={styles.remove}
                    type='button' 
                    onClick={() => removePolygon(selectedPolygon.polygon.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleApiMap>
      )}
    </div>
  )
}
