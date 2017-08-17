import { schema } from 'normalizr';
import { OrderRequest } from '../models/order-request';

export const orderRequests = new schema.Entity('orderRequests', {}, {
  idAttribute: 'orderRequestId',
  processStrategy: (a,b,c) => {
    console.log(a,b,c, new OrderRequest(a));
    return new OrderRequest(a);
  }
});
