/*
 * {
    TODO Example interface data
  }
*/

import { OrderRequestStatuses } from './index';

interface Required {
  statusId: number;
}

interface Optional {
  statusDesc: OrderRequestStatuses;
}

type OrderRequestItemStatus = Required & Partial<Optional>;
export default OrderRequestItemStatus;
export {
  Required,
  Optional,
};
