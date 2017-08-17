/*
 * {
    TODO Example interface data
  }
*/

interface OrderRequestItemGeoPlace extends Partial<Optional> {
  latitude: number;
  longitude: number;
}

interface Optional {
  altitude: number;
  geoPlaceId: number;
}

export default OrderRequestItemGeoPlace;
