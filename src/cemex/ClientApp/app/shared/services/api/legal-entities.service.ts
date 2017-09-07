import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class LegalEntitiesApi {

    constructor(private Api: Api) {}

    all(): Observable<Response> {
        return this.Api.get(`/v4/sm/mylegalentities`);
    }
}