import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class ProductLineApi {
    constructor(private api: Api) {
    }

    all(): Observable<Response> {
        return this.api.get("/v4/sm/productlines");
    }

}
