import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from '../api/api';

@Injectable()
export class OrdersApi {
    constructor(private api: Api) {
    }

    all(customerId: string, take: number = 100): Observable<Response> {
        return this.api.get(`/v2/sm/orders`);
    }

}