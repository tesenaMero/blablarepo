import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class PurchaseOrderApi {
    constructor(private api: Api) {}
    private CEMENT_BAG_ID = "2";

    // /v4/sm/purchaseorders/8000000610/validate?productLine=6&jobsiteId=1059
    validate(purchaseOrder: string, productLine: any, location: any) {
        // Case when both product lines in one
        if (productLine.productLineId = "2,3") { productLine.productLineId = this.CEMENT_BAG_ID }
        return this.api.get("/v4/sm/purchaseorders/" + purchaseOrder + "/validate?productLine=" + productLine.productLineId + "&jobsiteId=" + location.shipmentLocationId);
    }
}