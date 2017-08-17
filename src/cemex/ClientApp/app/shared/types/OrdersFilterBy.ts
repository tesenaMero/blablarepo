/*
 * {
    TODO Example interface data
  }
*/

import {
  OrderRequestItemStatuses,
  ProductDescTypes,
} from './index';

interface OrdersFilterBy {
  date: {
    from?: Date;
    to?: Date;
  };
  productType: ProductDescTypes | null;
  location: string | null;
  status: OrderRequestItemStatuses | null;
}

export default OrdersFilterBy;
