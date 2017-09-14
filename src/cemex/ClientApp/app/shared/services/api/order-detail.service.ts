import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class OrderDetailApi {
    constructor(private api: Api) {
    }

    byIdType(orderId: number, orderType: string): Observable<Response> {
        return this.api.get("/v4/sm/orders/" + orderId + "?orderType=" +orderType);
    }

}
