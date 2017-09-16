import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';                                                                                                                

import { Api } from './api.service';

@Injectable()
export class DraftsService {
    _draftId: any = '';
    constructor(private api: Api) {
    }

    add(order: any): Observable<Response> {
        return this.api.post("/v4/sm/orders", order);
    }

    prices(draftId: any): Observable<Response> {
        return this.api.patch("/v4/sm/orders/" + draftId + "/prices");
    }

    createOrder(draftId: any): Observable<Response> {
        return this.api.patch("/v4/sm/orders/" + draftId + "/requested");
    }

    draftId(id) {
        this._draftId = id;
    }
}