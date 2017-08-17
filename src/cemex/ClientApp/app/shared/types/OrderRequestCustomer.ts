interface OrderRequestCustomer extends Partial<Optional> {
  customerId: number;
}

interface Optional {
  customerCode: string;
  customerDesc: string;
}

export default OrderRequestCustomer;
