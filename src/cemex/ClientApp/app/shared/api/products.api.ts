import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from '../api/api';

@Injectable()
export class ProductsApi {
    constructor(private api: Api) {
    }

    top(shipmentLocation: any): Observable<Response> {
        return this.api.get(`/v4/sm/myproducts`);
    }

}