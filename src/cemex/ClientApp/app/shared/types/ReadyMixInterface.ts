/*
 * {
    TODO Example interface data
  }
*/

interface ReadyMixInterface {
  deliveryAddress: string;
  siteMobilePhone: string;
  quantity: number;
  city: string;
  zipCode: string;
  product: string;
  projectProfile: string;
  state: string;
  deliveryOrPickup: string;
  latitude: number;
  longitude: number;
  geoPlace: {
    geoPlaceId: number;
    altitude: number;
    latitude: number;
    longitude: number;
  };
  purchaseOrderNumber: string;
  UM: string;
  siteContact: string;
  contractNumber: string;
  streetAndNumber: string;
  specialInstructions: string;
  suggestedDateTime: string;
}

export default ReadyMixInterface;
