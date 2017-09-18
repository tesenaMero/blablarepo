import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class PurchaseOrderApi {
    constructor(private api: Api) {}

    // /v4/sm/purchaseorders/8000000610/validate?productLine=6&jobsiteId=1059
    async validate(purchaseOrder: string, productLine: any, location: any) {
        const response = await this.api.get("/v4/sm/purchaseorders/" + purchaseOrder + "/validate?productLine=" + productLine.productLineId + "&jobsiteId=" + location.shipmentLocationId).toPromise();
        
        return response.json();
    }
}