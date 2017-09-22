import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class ContractsApi {

    constructor(private Api: Api) {}
    
    all(customerId: string): Observable<Response> {
        // `/v1/qm/myagreements?status=ORDERTAKING&include=jobsite,address,geodata,segmentation,items,pointofdelivery,businesslines,geodata&productTypeId=6`
        return this.Api.get(`/v1/qm/myagreements?status=ORDERTAKING&customerId=${customerId}&include=jobsite,address,geodata,items,pointofdelivery,geodata`);
    }

    editPurchaseOrderNumber(agreementId: any, purchaseOrderNumber: string): Observable<Response> {
        return this.Api.patch(`/v1/qm/agreements/${agreementId}`, JSON.stringify({ purchaseOrder: purchaseOrderNumber }));
    }

    byProductTypeId(customerId, productTypeId): Observable<Response> {
        return this.Api.get(`/v1/qm/myagreements?customerId=${customerId}&status=ORDERTAKING&include=jobsite,address,geodata,items,pointofdelivery,geodata&productTypeId=${productTypeId}`);
    }
}
