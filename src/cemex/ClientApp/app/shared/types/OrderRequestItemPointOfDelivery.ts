/*
 * {
    TODO Example interface data
  }
*/

import { OrderRequestItemAddress } from './index';

interface OrderRequestItemPointOfDelivery extends Partial<OptionalOrderRequestItemPointOfDelivery> {
  pointOfDeliveryId: number;
}

interface OptionalOrderRequestItemPointOfDelivery {
  address: OrderRequestItemAddress;
  pointOfDeliveryCode: string;
  pointOfDeliveryDesc: string;
}

export default OrderRequestItemPointOfDelivery;
