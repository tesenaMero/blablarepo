/*
 * {
    TODO Example interface data
  }
*/

import {
  OrderRequestItemContact,
  OrderRequestItemContract,
  OrderRequestItemPointOfDelivery,
  OrderRequestItemProduct,
  OrderRequestItemPurchaseOrder,
  OrderRequestItemSalesOrder,
  OrderRequestItemStatus,
  OrderRequestItemTimeFrame,
} from './index';

interface Optional {
  addItem: boolean;
  orderRequestItemCode: string;
  itemAmount: number;
  sapId: any; // from console
  allFieldsAreRequired: boolean; // <-- FE only
  selectedPod: string | undefined; // <-- FE only
  isSaved: boolean;
  salesOrder: OrderRequestItemSalesOrder;
  contact: OrderRequestItemContact;
  productType: {
    productTypeId: number;
    productTypeCode: string;
    productTypeDesc: string;
  };
}

interface Required {
  contract: OrderRequestItemContract;
  orderRequestItemId: number;
  orderRequestItemStatus: OrderRequestItemStatus;
  pointOfDelivery: OrderRequestItemPointOfDelivery;
  products: OrderRequestItemProduct[];
  purchaseOrder: OrderRequestItemPurchaseOrder;
  specialInstructions: string;
  timeFrames: OrderRequestItemTimeFrame[];
}

type OrderRequestItem = Required & Partial<Optional>;
export default OrderRequestItem;
