/*
 * {
    TODO Example interface data
  }
*/

interface OrderRequestItemContract extends Partial<OptionalOrderRequestItemContract> {
  contractId: number;
}

interface OptionalOrderRequestItemContract {
  contractCode: string;
  currency: {
    unitId: number;
    unitCode: string;
    unitDesc: string;
  };
}

export default OrderRequestItemContract;
