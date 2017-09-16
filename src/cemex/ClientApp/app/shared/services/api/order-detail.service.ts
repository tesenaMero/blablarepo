import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';
import { CustomerService } from '../customer.service'

@Injectable()
export class OrderDetailApi {
    constructor(private api: Api, private customerService: CustomerService) {
    }

    byIdType(orderId: number, orderType: string): Observable<Response> {
        return this.api.get("/v4/sm/orders/" + orderId + "?orderType=" +orderType);
    }

}