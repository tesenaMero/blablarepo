import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class PlantApi {
    
    constructor(private api: Api) {}

    byCountryCodeAndRegionCode(countryCode: string, regionCode: string): Observable<Response> {
        return this.api.get(`/v5/dm/plants?countryCode=${countryCode}&regionCode=${regionCode}`);
    }

}