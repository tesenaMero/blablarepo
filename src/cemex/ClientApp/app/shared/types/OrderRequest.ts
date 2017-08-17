/*
 * {
    TODO Example interface data
  }
*/

import { OrderRequestCustomer, OrderRequestItem, OrderRequestStatus } from './index';

interface Required {
  orderRequestId: number;
  // orderRequestCode: string;
  orderRequestStatus: OrderRequestStatus;
  customer: OrderRequestCustomer;
  orderRequestItems: OrderRequestItem[];
};

interface Optional {
  id: number;
  orderRequestName: string;
  orderRequestStatus: OrderRequestStatus;
  orderRequestedOn: string | null; // use for both draft and requested.
  viewedAt: string;
  isFavorite: boolean;
  totalAmount: number;
  user: {
    fullname: string;
  };
  orderRequestedBy: string;
};

type OrderRequest = Required & Partial<Optional>;

export default OrderRequest;
