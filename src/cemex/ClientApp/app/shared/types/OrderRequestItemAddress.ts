/*
 * {
    TODO Example interface data
  }
*/

import { OrderRequestItemGeoPlace } from './index';

interface OrderRequestItemAddress extends Partial<OptionalOrderRequestItemAddress> {
  addressCode: string;
  countryCode: string;
}

interface OptionalOrderRequestItemAddress {
  addressId: number;
  cityDesc: string;
  domicileNum: string;
  geoPlace: OrderRequestItemGeoPlace;
  postalCode: string;
  regionCode: string;
  regionDesc: string;
  regionId: number;
  settlementDesc: string;
  streetName: string;
}

export default OrderRequestItemAddress;
