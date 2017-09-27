import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class SalesDocumentApi {
    constructor(private api: Api) {}

    validate(purchaseOrder: string, productLine: any, location: any) {
        return this.api.get("/v4/sm/purchaseorders/" + purchaseOrder + "/validate?productLine=" + productLine.productLineId + "&jobsiteId=" + location.shipmentLocationId);
    }

    all() {
        return this.api.get("/v4/im/salesdocumenttypes");
    }
}