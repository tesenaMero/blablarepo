/*
 * {
    TODO Example interface data
  }
*/

interface OrderRequestItemBusinessLine extends Partial<Optional> {
  businessLineId: number;
}

export interface Optional {
  businessLineCode: string;
  businessLineDesc: string;
}

export default OrderRequestItemBusinessLine;
