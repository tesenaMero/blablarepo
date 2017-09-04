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
}
