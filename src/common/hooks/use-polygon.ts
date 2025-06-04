import {useEffect, useRef, useState, useCallback} from 'react'
import {Polygon, SelectedPolygon} from '../type'

export function usePolygon(params: {
  map: google.maps.Map | null
  polygons: Array<Polygon>
  isPolygon: boolean
  onClickPolygon: (val: SelectedPolygon) => void
}) {
  const polygonPathRef = useRef<google.maps.MVCArray<google.maps.LatLng> | null>(null)
  const polygonsRef = useRef<google.maps.Polygon[]>([])
  const [isDrawing, setIsDrawing] = useState(false)

  const getPolygon = useCallback(() => {
    if (!polygonPathRef.current) {
      return null
    }

    const coordinates = (polygonPathRef.current?.getArray() || []).map((latLng) => ([latLng.lng(), latLng.lat()]))

    if((coordinates || []).length < 3) {
      return null
    }

    return {
      type: 'Polygon',
      coordinates: [[...coordinates, coordinates[0]]]
    }
  }, [])

  const clearPolygon = useCallback(() => {
    polygonPathRef.current?.clear()
    setIsDrawing(false)
  }, [polygonPathRef])

  useEffect(() => {
    if (!params.map || !params.isPolygon) {
      clearPolygon()
      return
    }

    const handleClick = (e: google.maps.MapMouseEvent) => {
      setIsDrawing(true)

      if (!polygonPathRef?.current) {
        const paths = new google.maps.MVCArray([e.latLng!])
        polygonPathRef.current = paths

        new google.maps.Polygon({
          paths,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          editable: true,
          draggable: true,
          map: params.map,
        })

        return
      }

      if (polygonPathRef.current && polygonPathRef.current.getLength() < 4) {
        polygonPathRef.current.push(e.latLng!)
      }
    }

    const clickListener = params.map.addListener('click', handleClick)
    return () => google.maps.event.removeListener(clickListener)
  }, [params.map, clearPolygon, params.isPolygon])

  // Add display of existing polygons
  useEffect(() => {
    if (!params.map || !params.polygons) {
      return
    }

    const polygons = (params.polygons || []).map(polygon => {
      const coordinates = (polygon?.coords?.coordinates?.[0] || [])
        .filter(item => typeof item[0] === 'number' && typeof item[1] === 'number')

      if (!coordinates || coordinates.length < 3) return null

      return {polygon, coordinates: coordinates.map(item => ({lat: item[1], lng: item[0]}))}
    })


    polygonsRef.current.forEach((polygon) => polygon.setMap(null))
    polygonsRef.current = []

    polygons.forEach((item) => {
      if (!item) return

      const polygon = new google.maps.Polygon({
        paths: item.coordinates,
        strokeColor: '#0000FF',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#0000FF',
        fillOpacity: 0.35,
        editable: false,
        map: params.map,
        clickable: true,
      })

      polygon.addListener('click', () => params.onClickPolygon({
        polygon: item.polygon, 
        topPoint: item.coordinates.reduce((highest, current) => (current.lat > highest.lat ? current : highest)),
      }))

      polygonsRef.current.push(polygon)
    })
  }, [params])

  return {getPolygon, clearPolygon, isDrawing}
}