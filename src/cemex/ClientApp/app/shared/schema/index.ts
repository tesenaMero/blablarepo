import { Injectable } from '@angular/core';
import { schema, normalize } from 'normalizr';
import { OrderRequest } from '../models/order-request';

export const orderRequests = new schema.Entity('orderRequests', {}, {
  idAttribute: 'orderId',
  processStrategy: (a,b,c) => new OrderRequest(a)
});

@Injectable()
export class OrdersModel {
  constructor() {
  }
  getModelOrders(orders) {
    const normalized = normalize(orders, [orderRequests]);
    return normalize(orders, [orderRequests]);
  }
}