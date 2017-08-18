import { schema } from 'normalizr';
import { OrderRequest } from '../models/order-request';

export const orderRequests = new schema.Entity('orderRequests', {}, {
  idAttribute: 'orderRequestId',
  processStrategy: (a,b,c) => new OrderRequest(a)
});
