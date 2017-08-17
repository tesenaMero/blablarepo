/*
 * {
    TODO Example interface data
  }
*/

import { OrderRequestItemStatuses } from './index';

interface Required {
  statusId: number;
}

interface Optional {
  statusDesc: OrderRequestItemStatuses;
  statusCode: string;
}

type OrderRequestItemStatus = Required & Partial<Optional>;

export default OrderRequestItemStatus;
