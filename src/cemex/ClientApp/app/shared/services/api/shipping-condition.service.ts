import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class ShippingConditionApi {

    constructor(private Api: Api) {}

    all(customerId): Observable<Response> {
        return this.Api.get(`/v1/im/shippingconditions?customerId=${customerId}`);
    }

    byCode(customerId: any, shippingConditionCode: any): Observable<Response> {
        return this.Api.get(`/v1/im/shippingconditions?customerId=${customerId}&shippingConditionCode=${this.pad(shippingConditionCode, 2)}`);
    }

    pad(n, width, z?) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
}
