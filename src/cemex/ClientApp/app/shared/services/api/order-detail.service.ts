import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class OrderDetailApi {
    constructor(private api: Api) {
    }

    byId(orderId: number): Observable<Response> {
        return this.api.get("/v2/sm/orders/" + orderId + "?orderType=SLS");
    }

}
