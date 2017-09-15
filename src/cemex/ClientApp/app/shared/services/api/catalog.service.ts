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

    byProductLine(customerId, productCode): Observable<Response> {
        return this.Api.get(`/v1/sm/catalogs?customerId=${customerId}&productLine=${productCode}`);
    }
}
  