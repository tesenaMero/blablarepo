import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class LoginApi {

    constructor(private Api: Api) {}
    
    all(customerId: string, take: number = 100): Observable<Response> {
        return this.Api.get(`/v1/sm/myorderrequests?include=requestitem&take=${take}&customerId=${customerId}`);
    }

    login(username, password): Observable<Response> {
        this.Api.clearToken();
        return this.Api.post('/v2/secm/oam/oauth2/token', 
            `grant_type=password&scope=security&username=${username}&password=${password}&client_id=${this.Api.clientId}`,
            {
                headers: new Headers({ 'content-type': 'application/x-www-form-urlencoded' })
            }
        );
    }

    getProfile(): Observable<Response> {
        return this.Api.get('/v5/secm/user');
    }

    getCustomers(): Observable<Response> {
        return this.Api.get('/v1/cum/mycustomers');
    }
}
