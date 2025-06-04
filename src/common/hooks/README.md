
- Install retool cli
- Generate googleMapsApiKey
- Create queries: 
    get_polygons
    add_polygon - add Events handlers (success -> get_polygons.trigger())
    delete_polygon - add Events handlers (success -> get_polygons.trigger())



query OrbForbiddenArea {
  orbForbiddenArea {
    id
    geofence
  }
}

mutation InsertPolygon($coords: geography!) {
  insert_orbForbiddenArea_one(object: { geofence: $coords }) {
    id
  }
}

mutation DeletePolygon($id: uuid = "") {
  delete_orbForbiddenArea_by_pk(id: $id) {
    id
  }
}