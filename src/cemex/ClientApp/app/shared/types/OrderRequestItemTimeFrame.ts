/*
 * {
    TODO Example interface data
  }
*/

interface OrderRequestItemTimeFrame extends Partial<Optional> {
  timeFrameId: number;
  deliveryDateTimeFrom: string;
  deliveryPriority: number;
}

interface Optional {
  deliveryDateTimeTo: string;
}

export default OrderRequestItemTimeFrame;
