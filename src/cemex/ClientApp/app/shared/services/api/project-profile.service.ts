import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class ProjectProfileApi {

    constructor(private Api: Api) {}
    
    all(customerId: string): Observable<Response> {
        return this.Api.get(`/v1/rc/myprofiles?customerId=${customerId}&include=projectproperties`);
    }

    delete(profileId): Observable<Response> {
        return this.Api.delete(`/v1/rc/profiles/${profileId}`);
    }

    create(projectProfile, customerId): Observable<Response> {
        return this.Api.post('/v1/rc/profiles', JSON.stringify({
            ...projectProfile,
            customer: {
                customerId,
            },
        }));
    }

    edit(projectProfile, customerId): Observable<Response> {
        return this.Api.get(`/v1/rc/profiles/${projectProfile.profileId}`, JSON.stringify({
            ...projectProfile,
            customer: {
                customerId,
            },
        }));
    }
}
