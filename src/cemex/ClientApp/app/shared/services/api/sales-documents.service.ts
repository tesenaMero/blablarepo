import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class SalesDocumentApi {
    constructor(private api: Api) {}

    // /v4/sm/purchaseorders/8000000610/validate?productLine=6&jobsiteId=1059
    validate(purchaseOrder: string, productLine: any, location: any) {
        return this.api.get("/v4/sm/purchaseorders/" + purchaseOrder + "/validate?productLine=" + productLine.productLineId + "&jobsiteId=" + location.shipmentLocationId);
    }

    all() {
        return this.api.get("/v4/im/salesdocumenttypes");
    }
}