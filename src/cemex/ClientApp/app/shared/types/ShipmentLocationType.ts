/*
 * {
    TODO Example interface data
  }
*/

interface Required {
  shipmentLocationTypeId: number;
}

interface Optional {
  
}

type ShipmentLocationType = Required & Partial<Optional>;

export default ShipmentLocationType;
