import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class ProductsApi {
    constructor(private api: Api) {
    }

    top(shipmentLocation: any): Observable<Response> {
        return this.api.get(`/v2/mm/myproducts?shipmentLocationId=` + shipmentLocation.shipmentLocationId + ".5&productLineId=6&salesDocumentTypeId=3");
    }

    advancedSearch(shipmentLocationId): Observable<Response> {
        return this.api.get(`/v2/mm/myproducts?shipmentLocationId=${shipmentLocationId}&salesDocumentTypeId=4&productLineId=1`);
    }
}