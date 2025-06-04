type Coords = {
  type: 'Polygon'
  crs: {
    type: string
    properties: {name: string}
  }
  coordinates: number[][][]
}

export type Polygon = {id: string, coords: Coords}
export type SelectedPolygon = {polygon: Polygon, topPoint: {lat: number; lng: number}}