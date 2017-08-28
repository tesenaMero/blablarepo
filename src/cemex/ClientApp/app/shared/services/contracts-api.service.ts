import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';

@Injectable()
export class ContractsApiService {

    constructor(private ApiService: ApiService) {}
    
    all(customerId: string): Observable<Response> {
        return this.ApiService.get(`v1/qm/myagreements?status=ORDERTAKING&customerId=${customerId}&activeOn=${new Date().toISOString()}&include=jobsite,address,geodata,items,pointofdelivery,geodata`);
    }

    editPurchaseOrderNumber(agreementId: any, purchaseOrderNumber: string): Observable<Response> {
        return this.ApiService.patch(`v1/qm/agreements/${agreementId}`, JSON.stringify({ purchaseOrder: purchaseOrderNumber }));
    }

    byProductTypeId(customerId, productTypeId): Observable<Response> {
        return this.ApiService.get(`v1/qm/myagreements?customerId=${customerId}&status=ORDERTAKING&include=jobsite,address,geodata,items,pointofdelivery,geodata&productTypeId=${productTypeId}`);
    }
}
