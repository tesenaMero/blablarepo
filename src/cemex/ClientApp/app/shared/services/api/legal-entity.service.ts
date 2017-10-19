import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class LegalEntityApi {

    constructor(private api: Api) {}
    
    byCustomerId(id: string): Observable<Response> {
        return this.api.get(`/v2/cum/customers/${id}?include=address`);
    }
}
