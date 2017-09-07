import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class OrdersApi {

    constructor(private Api: Api) {}
    
    all(customerId: string, take: number = 100): Observable<Response> {
        return this.Api.get(`/v4/sm/orders?include=orderitem`);
    }

    byId(orderRequestId: number): Observable<Response> {
        return this.Api.get((`/v1/sm/orderrequests/${orderRequestId}?include=contract,timeFrames,product,address,contact`));
    }

    patchOrder(order): Observable<Response> {
        return this.Api.patch(`/v1/sm/orderrequests/${order.orderRequestId}`, JSON.stringify(order));
    }

    favoriteOrder(orderRequestId: number, isFavorite: boolean): Observable<Response> {
        return this.Api.patch(`/v1/sm/orderrequests/${orderRequestId}`, JSON.stringify({ isFavorite }));
    }

    editRequestOrderItem(orderRequestItem): Observable<Response> {
        return this.Api.put(`/v1/sm/orderrequestitems/${orderRequestItem.orderRequestItemId}`, JSON.stringify(orderRequestItem));
    }

    create(orderRequest): Observable<Response> {
        return this.Api.post(`/v1/sm/orderrequests`, JSON.stringify(orderRequest));
    }

    createOrderItem(orderRequestId, orderRequestItem): Observable<Response> {
        return this.Api.post(`/v1/sm/orderrequests/${orderRequestId}/item`, JSON.stringify(orderRequestItem));
    }

    delete(orderRequestId: number): Observable<Response> {
        return this.Api.delete(`/v1/sm/orderrequests/${orderRequestId}`);
    }

    deleteOrderItem(orderRequestItemId): Observable<Response> {
        return this.Api.delete(`/v1/sm/orderrequestitems/${orderRequestItemId}`);
    }

    updateOrderName(orderRequestName: string, orderRequestId: number): Observable<Response> {
        return this.Api.patch(`/v1/sm/orderrequests/${orderRequestId}`, JSON.stringify({ orderRequestName }));
    }

    sendComment(orderRequestItemId: number, comment: string): Observable<Response> {
        return this.Api.post(`/v1/sm/orderrequestitems/${orderRequestItemId}/comments`, JSON.stringify({ commentDesc: comment }));
    }

    getComments(orderRequestItemId: number, perPage: number = 5, page: number = 1): Observable<Response> {
        return this.Api.get(`/v1/sm/orderrequestitems/${orderRequestItemId}/comments?fetch=${perPage}&page=${page}`);
    }

    fetchLogs(orderRequestItemId: number, perPage: number = 5, page: number = 1): Observable<Response> {
        return this.Api.get(`/v1/sm/orderrequestitems/${orderRequestItemId}/logs?fetch=${perPage}&page=${page}`);
    }

}
