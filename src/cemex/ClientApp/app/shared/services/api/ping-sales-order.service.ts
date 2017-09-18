import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Api } from './api.service';

@Injectable()
export class PingSalesOrderApi {
    constructor(private api: Api) {        
    }

    validatePingSalesOrder () {
        return this.api.get("/v4/sm/pingsalesorder");
    }
}
