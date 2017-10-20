import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class OrdersApi {

    constructor(private api: Api) {}
    
    all(customerId?: string, take: number = 100): Observable<Response> {
        return this.api.get(`/v4/sm/orders?include=orderitem`);
    }

    byId(orderRequestId: number): Observable<Response> {
        return this.api.get(`/v1/sm/orderrequests/${orderRequestId}?include=contract,timeFrames,product,address,contact`);
    }

    patchOrder(order): Observable<Response> {
        return this.api.patch(`/v1/sm/orderrequests/${order.orderRequestId}`, JSON.stringify(order));
    }

    favoriteOrder(orderRequestId: number, isFavorite: boolean): Observable<Response> {
        return this.api.patch(`/v1/sm/orderrequests/${orderRequestId}`, JSON.stringify({ isFavorite }));
    }

    editRequestOrderItem(orderRequestItem): Observable<Response> {
        return this.api.put(`/v1/sm/orderrequestitems/${orderRequestItem.orderRequestItemId}`, JSON.stringify(orderRequestItem));
    }

    create(orderRequest): Observable<Response> {
        return this.api.post(`/v1/sm/orderrequests`, JSON.stringify(orderRequest));
    }

    createOrderItem(orderRequestId, orderRequestItem): Observable<Response> {
        return this.api.post(`/v1/sm/orderrequests/${orderRequestId}/item`, JSON.stringify(orderRequestItem));
    }

    delete(orderRequestId: number): Observable<Response> {
        return this.api.delete(`/v1/sm/orderrequests/${orderRequestId}`);
    }

    deleteOrderItem(orderRequestItemId): Observable<Response> {
        return this.api.delete(`/v1/sm/orderrequestitems/${orderRequestItemId}`);
    }

    updateOrderName(orderRequestName: string, orderRequestId: number): Observable<Response> {
        return this.api.patch(`/v1/sm/orderrequests/${orderRequestId}`, JSON.stringify({ orderRequestName }));
    }

    sendComment(orderRequestItemId: number, comment: string): Observable<Response> {
        return this.api.post(`/v4/sm/orders/${orderRequestItemId}/comments`, JSON.stringify({ commentDesc: comment }));
    }

    getComments(orderRequestItemId: number, perPage: number = 5, page: number = 1): Observable<Response> {
        return this.api.get(`/v4/sm/orders/${orderRequestItemId}/comments?fetch=${perPage}&page=${page}`);
    }

    fetchLogs(orderRequestItemId: number, perPage: number = 5, page: number = 1): Observable<Response> {
        return this.api.get(`/v4/sm/orders/${orderRequestItemId}/logs?fetch=${perPage}&page=${page}`);
    }

}