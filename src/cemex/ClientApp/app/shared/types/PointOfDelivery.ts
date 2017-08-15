/*
 * {
    TODO Example interface data
  }
*/

import { Address } from './index';

interface PointOfDelivery {
  pointOfDeliveryId: number;
  pointOfDeliveryCode: string;
  pointOfDeliveryDesc: string;
  address: Address;
  // segmentations: Segmentation[];
}

export default PointOfDelivery;
