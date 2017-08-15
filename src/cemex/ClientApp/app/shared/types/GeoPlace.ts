/*
 * {
    TODO Example interface data
  }
*/

// api structure does not have: geoPlaceId and altitude

interface GeoPlace {
  geoPlaceId: number;
  latitude: number;
  longitude: number;
  altitude: number;
  geoPlaceType: string;
  geoFenceRadius: number;
}

export default GeoPlace;
