/*
 * {
    TODO Example interface data
  }
*/

import { ShipmentLocationType } from './index';

interface Required {
  shipmentLocationId: number;
  shipmentLocationType: ShipmentLocationType;
}

interface Optional {
  
}

type ShipmentLocation = Required & Partial<Optional>;

export default ShipmentLocation;
