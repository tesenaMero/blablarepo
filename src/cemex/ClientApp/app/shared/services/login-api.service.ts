import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';

@Injectable()
export class LoginApiService {

    constructor(private ApiService: ApiService) {}
    
    all(customerId: string, take: number = 100): Observable<Response> {
        return this.ApiService.get(`v1/sm/myorderrequests?include=requestitem&take=${take}&customerId=${customerId}`);
    }

    login(username, password): Observable<Response> {
        this.ApiService.clearToken();
        return this.ApiService.post('v2/secm/oam/oauth2/token', 
            `grant_type=password&scope=security&username=${username}&password=${password}&client_id=${this.ApiService.clientId}`,
            {
                headers: new Headers({ 'content-type': 'application/x-www-form-urlencoded' })
            }
        );
    }

    getProfile(): Observable<Response> {
        return this.ApiService.get('v5/secm/user');
    }

    getCustomers(): Observable<Response> {
        return this.ApiService.get('v1/cum/mycustomers');
    }
}
