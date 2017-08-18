import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { normalize } from 'normalizr';

import { OrdersApiService } from './orders-api.service';
import { OrderRequest } from '../types';
import { OrderRequest as OrderRequestModal } from '../models/order-request';
import * as schema from '../schema/index';


interface ById {
  [key: string]: any;
}

type AllIds = number[];

interface OrdersState {
    byId: ById;
    allIds: AllIds;
}

/**
 * OrdersService service
 * Manage, Manipulate and store the global state of orders
 * Keeping the orders state in normalized state (allIds, byId) 
 * Each order is an OrderRequest instance model
 */

@Injectable()
export class OrdersService {
    private _orders: BehaviorSubject<OrdersState>;
    private _isLoading:  BehaviorSubject<boolean>;
    private _error: BehaviorSubject<string | null>;

    constructor(private OrdersApiService: OrdersApiService) {
        this._orders = <BehaviorSubject<OrdersState>> new BehaviorSubject({ byId: {}, allIds: []});
        this._isLoading = <BehaviorSubject<boolean>> new BehaviorSubject(false);
        this._error = <BehaviorSubject<string | null>> new BehaviorSubject(null);
    }
    
    public fetchAllOrders() {
        this._isLoading.next(true);
        this._error.next(null);

        // TODO depend on user service for customerId
        this.OrdersApiService.all("4169", 100)
            .map(response => response.json())
            .map(orders => normalize(orders.orderRequests, [ schema.orderRequests ]))
            .subscribe(response => {
                this._orders.next({ allIds: response.result, byId: response.entities.orderRequests });
                this._isLoading.next(false);
            }, err => {
                this._error.next("Failed fetching orders");
            })
    }

    private _favorite(orderRequestId, isFavorite) {
        const orderRequest = this._orders.getValue().byId[orderRequestId];
        orderRequest && orderRequest.setFavorite(isFavorite);
    }

    public favoriteOrder(orderRequestId, isFavorite) {
        this._favorite(orderRequestId, isFavorite);
        this.OrdersApiService.favoriteOrder(orderRequestId, isFavorite)
            .map(response => response.json())
            .subscribe(response => {
                // success do nothing
            }, err => {
                // favoring failed, restore favorite state
                this._favorite(orderRequestId, !isFavorite);
            })
    }

    public getOrders() {
        return this._orders.map((state) => state.allIds.map((id) => state.byId[id] ));
    }

    public isLoading() {
        return this._isLoading.asObservable();
    }
}
