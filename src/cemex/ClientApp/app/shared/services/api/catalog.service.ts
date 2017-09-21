import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class CatalogApi {

    constructor(private Api: Api) {}
    
    byCode(code: string): Observable<Response> {
        return this.Api.get(`/v4/ce/catalogs?code=${code}`);
    }

    byProductLine(customerId, productLineId): Observable<Response> {
        if (productLineId === "2,3") { productLineId = "2"; }
        if (productLineId === 6) { productLineId = "0006"; }
        
        return this.Api.get(`/v1/sm/catalogs?customerId=${customerId}&productLine=${productLineId}`);
    }
}
