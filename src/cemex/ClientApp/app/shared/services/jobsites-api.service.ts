import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';

@Injectable()
export class JobsiteApiService {

    constructor(private ApiService: ApiService) {}

    all(): Observable<Response> {
        return this.ApiService.get(`v4/sm/myshipmentlocations`);
    }
    
    byId(jobsiteId): Observable<Response> {
        return this.ApiService.get(`v5/dm/jobsites/${jobsiteId}?include=businessline,address,contact`);
    }
}
