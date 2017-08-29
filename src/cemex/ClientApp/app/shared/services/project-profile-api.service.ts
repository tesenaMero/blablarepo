import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';

@Injectable()
export class ProjectProfileApiService {

    constructor(private ApiService: ApiService) {}
    
    all(customerId: string): Observable<Response> {
        return this.ApiService.get(`v1/rc/myprofiles?customerId=${customerId}&include=projectproperties`);
    }

    delete(profileId): Observable<Response> {
        return this.ApiService.delete(`v1/rc/profiles/${profileId}`);
    }

    create(projectProfile, customerId): Observable<Response> {
        return this.ApiService.post('v1/rc/profiles', JSON.stringify({
            ...projectProfile,
            customer: {
                customerId,
            },
        }));
    }

    edit(projectProfile, customerId): Observable<Response> {
        return this.ApiService.get(`v1/rc/profiles/${projectProfile.profileId}`, JSON.stringify({
            ...projectProfile,
            customer: {
                customerId,
            },
        }));
    }
}
