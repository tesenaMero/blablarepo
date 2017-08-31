import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { ApiService } from '../services/api.service';

@Injectable()
export class CoreApi {
    constructor(private ApiService: ApiService) {
    }

    shipmentLocations(): Observable<Response> {
        return this.ApiService.get(`v4/sm/myshipmentlocations`);
    }

    productsLines(): Observable<Response> {
        return this.ApiService.get(`v4/sm/productlines`);
    }

}
