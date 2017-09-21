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

    getDraft(draftId: any): Observable<Response> {
        return this.api.get(`/v4/sm/orders/${draftId}?orderType=DFT`);
    }

    prices(draftId: any): Observable<Response> {
        return this.api.patch("/v4/sm/orders/" + draftId + "/prices");
    }

    optimalSourcesPatch(draftId: any): Observable<Response> {
        return this.api.patch("/v4/sm/orders/" + draftId + "/optimalsources");
    }

    createOrder(draftId: any, data?: any): Observable<Response> {
        return this.api.patch("/v4/sm/orders/" + draftId + "/requested", '');
    }

    draftId(id) {
        sessionStorage.setItem('draftId', id);
        this._draftId = id;
    }

    optimalSource(draftId: any): Observable<Response> {
        return this.api.get("/v4/sm/orders/" + draftId + "/optimalsources");
    }
}