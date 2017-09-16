import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { normalize, schema } from 'normalizr';

import { OrdersApi } from './api';
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
import * as orderRequestSchema from '../schema/index';
import { OrdersModel } from '../schema';

const moment = require('moment');

// const FIXTURE = require('../../../mock.json');

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
                key: 'orderId',
                format: 'string',
                value: 'orderId',
            },
            {
                key: 'orderRequestId',
                format: 'string',
                value: 'orderCode',
            },
            {
                key: 'submitedOn',
                format: 'date',
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
                value: ['pointOfDelivery.pointOfDeliveryCode', 'pointOfDelivery.pointOfDeliveryDesc'],
            },
            {
                key: 'purchaseOrder',
                format: 'string',
                value: 'purchaseOrder',
                ignoreValue: 'purchaseOrder',
                defaultValue: '-',
            },
            {
                key: 'businessLine',
                format: 'string',
                value: 'salesArea.businessLine.businessLineCode',
            },
            {
                key: 'amount',
                format: 'qty',
                value: ['totalQuantity', 'unitDesc'],
                defaultValue: '0',
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
                key: 'statusCode',
                format: 'string',
                value: 'status.statusCode',
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
                ignoreValue: 'totalAmount',
                defaultValue: '0',
            },
            {
                key: 'totalFilter',
                format: 'numbers',
                value: 'totalAmount',
                ignoreValue: 'totalAmount',
                defaultValue: 0,
            },
            {
                key: 'orderType',
                format: 'string',
                value: 'orderType.orderTypeCode'
            }
        ]
    };
    private _orders: BehaviorSubject<OrdersState>;
    private _isLoading: BehaviorSubject<boolean>;
    private _error: BehaviorSubject<string | null>;
    private _totalItems: BehaviorSubject<number | 1>;
    private theOrders;
    private ordersModel;

    constructor(private OrdersApi: OrdersApi, private helper: OrderRequestHelper, private ordersModelService: OrdersModel) {
        this._orders = <BehaviorSubject<OrdersState>>new BehaviorSubject({ byId: {}, allIds: [] });
        this._isLoading = <BehaviorSubject<boolean>>new BehaviorSubject(false);
        this._totalItems = <BehaviorSubject<number>>new BehaviorSubject(1);
        this._error = <BehaviorSubject<string | null>>new BehaviorSubject(null);
    }

    public fetchAllOrders() {
        this._isLoading.next(true);
        this._error.next(null);

        // TODO depend on user service for customerId
        this.OrdersApi.all("4169", 100)
            .map(response => response.json())
            .map(json => {
                const flatten = this.helper.flattenData(json);
                const mappedData = this.helper.mapDataToResponseFormat(flatten, OrdersService.ORDER_REQUEST_MAPPING);
                this.theOrders = mappedData;
                const pagedOrders = this.getPagedOrders(1)
                return pagedOrders;
            })
            .subscribe(response => {
                this.ordersModel = response.entities.orderRequests;
                this._orders.next({ allIds: response.result, byId: response.entities.orderRequests });
                this._totalItems.next(Math.ceil(this.theOrders.length / 10));
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
        this.OrdersApi.favoriteOrder(orderRequestId, isFavorite)
            .map(response => response.json())
            .subscribe(response => {
                // success do nothing
            }, err => {
                // favoring failed, restore favorite state
                this._favorite(orderRequestId, !isFavorite);
            })
    }

    public getOrders() {
        return this._orders.map((state) => state.allIds.map((id) => state.byId[id]));
    }

    paginateOrders(page: number, itemsPerPage: number = 10) {
        const normalizedOrders = this.getPagedOrders(page, itemsPerPage);
        this._orders.next({ allIds: normalizedOrders.result, byId: normalizedOrders.entities.orderRequests })
    }

    private getPagedOrders(page: number, itemsPerPage: number = 10) {
        let index = page - 1;
        const pagedOrders = this.theOrders.slice( index*10, index*10 + itemsPerPage);
        const normalizedOrders = this.ordersModelService.getModelOrders(pagedOrders);
        return normalizedOrders;
    }

    orderBy(event: OrderByEvent) {
        let key = event.key;
        switch (event.key) {
            case 'requestedOn': {
                key = 'requestedOnFiltered';
                break;
            }
            case 'submitedOn': {
                key = 'submitedOnFiltered';
                break;
            }
            case 'submitedOn': {
                key = 'submitedOnFiltered';
                break;
            }
            case 'total': {
                key = 'totalFilter';
                break;
            }
            default: {
                key = event.key;
            }
        }

        this.theOrders.sort((n1, n2) => {
            if (n1[key] < n2[key]) {
                return event.asc ? -1 : 1;
            }
            if (n1[key] > n2[key]) {
                return event.asc ? 1 : -1;
            }
            return 0;
        });
        
        const orders = this.getPagedOrders(1, 10);
        this._orders.next({ allIds: orders.result, byId: orders.entities.orderRequests })
    }

    public isLoading() {
        return this._isLoading.asObservable();
    }

    public getTotalPages() {
        return this._totalItems.asObservable();
    }
}
