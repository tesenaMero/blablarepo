import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { normalize } from 'normalizr';

import { OrdersApiService } from './orders-api.service';
import { OrderRequest } from '../types';
import {
    OrderRequestHelper,
    OrderRequestTableComponentConfiguration,
    OrderRequestResponse,
    OrderRequestColumnConfiguration,
    OrderRequestLayoutColumnConfiguration,
    OrderRequestLayoutConfiguration 
} from '../../utils/order-request.helper';
import { OrderRequest as OrderRequestModal } from '../models/order-request';
import * as schema from '../schema/index';

const moment = require('moment');

const FIXTURE = require('../../../mock.json');

interface ById {
    [key: string]: any;
}

type AllIds = number[];

interface OrdersState {
    byId: ById;
    allIds: AllIds;
}

interface OrderByEvent {
    key: string;
    asc: boolean;
}

/**
 * OrdersService service
 * Manage, Manipulate and store the global state of orders
 * Keeping the orders state in normalized state (allIds, byId) 
 * Each order is an OrderRequest instance model
 */

@Injectable()
export class OrdersService {
    public static ORDER_REQUEST_MAPPING: OrderRequestTableComponentConfiguration = {
        columns: [
            {
                key: 'orderRequestId',
                format: 'string',
                value: 'orderCode',
            },
            {
                key: 'submitedOn',
                format: 'getDate',
                value: 'createdDateTime',
            },
            {
                key: 'submitedOnFiltered',
                format: 'getTime',
                value: 'createdDateTime',
            },
            {
                key: 'pointOfDelivery',
                format: 'string',
                value: 'pointOfDelivery.pointOfDeliveryDesc',
            },
            {
                key: 'purchaseOrder',
                format: 'string',
                value: 'purchaseOrder',
            },
            {
                key: 'businessLine',
                format: 'string',
                value: 'salesArea.businessLine.businessLineCode',
            },
            {
                key: 'amount',
                format: 'string',
                value: 'totalQuantity',
            },
            {
                key: 'requestedOn',
                format: 'getDate',
                value: 'requestedDateTime',
            },
            {
                key: 'requestedOnFiltered',
                format: 'getTime',
                value: 'requestedDateTime',
            },
            {
                key: 'status',
                format: 'string',
                value: 'status.statusDesc',
            },
            {
                key: 'unitDesc',
                format: 'string',
                value: 'unitDesc',
            },
            {
                key: 'total',
                format: 'currency',
                value: 'totalAmount',
            }
        ]
    };
    private _orders: BehaviorSubject<OrdersState>;
    private _isLoading: BehaviorSubject<boolean>;
    private _error: BehaviorSubject<string | null>;
    private theOrders;
    private ordersModel;

    constructor(private OrdersApiService: OrdersApiService, private helper: OrderRequestHelper) {
        this._orders = <BehaviorSubject<OrdersState>>new BehaviorSubject({ byId: {}, allIds: [] });
        this._isLoading = <BehaviorSubject<boolean>>new BehaviorSubject(false);
        this._error = <BehaviorSubject<string | null>>new BehaviorSubject(null);

    }

    public fetchAllOrders() {
        this._isLoading.next(true);
        this._error.next(null);

        // TODO depend on user service for customerId
        this.OrdersApiService.all("4169", 100)
            .map(response => response.json())
            .map(orders => {
                this.theOrders = orders.orderRequests;
                const flatten = this.helper.flattenData(FIXTURE);
                const mappedData = this.helper.mapDataToResponseFormat(flatten, OrdersService.ORDER_REQUEST_MAPPING);
                return normalize(mappedData, [schema.orderRequests]);
            })
            .subscribe(response => {
                this.ordersModel = response.entities.orderRequests;
                this._orders.next({ allIds: response.result, byId: this.ordersModel });
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
        // apply filters
        return this._orders.map((state) => state.allIds.map((id) => state.byId[id]));
    }

    orderBy(event: OrderByEvent) {
        event.key = event.key === 'time' ? 'requestedDateAndTimeForSorting' : event.key;
        // this._orders = this._orders
        this.theOrders.sort((n1, n2) => {
            if (n1[event.key] > n2[event.key]) {
                return event.asc ? -1 : 1;
            }
            if (n1[event.key] < n2[event.key]) {
                return event.asc ? 1 : -1;
            }
            return 0;
        });

        // const sorted = normalize(this.theOrders, [ schema.orderRequests ]);
        const ids = this.theOrders.map(order => order.orderRequestId);
        this._orders.next({ allIds: ids, byId: this.ordersModel })
    }

    public isLoading() {
        return this._isLoading.asObservable();
    }
}
