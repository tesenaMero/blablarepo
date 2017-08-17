/*
 * {
    TODO Example interface data
  }
*/

import { GeoPlace } from './index';

interface Address {
  addressId: number;
  addressCode: string;
  cityDesc: string;
  countryDesc: string;
  regionId: number;
  regionCode: string;
  regionDesc: string;
  countryCode: string;
  streetName: string;
  domicileNum: string;
  settlementDesc: string;
  postalCode: string;
  geoPlace: GeoPlace;
}

export default Address;
