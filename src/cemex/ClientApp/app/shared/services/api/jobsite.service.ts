import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class JobsiteApi {
    constructor(private api: Api) {
    }

    contacts(jobsiteId: number): Observable<Response> {
        return this.api.get("/v4/sm/jobsitecontacts?jobsiteId=" + jobsiteId);
    }

}
