import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class SalesDocumentApi {
    salesDocuments = new BehaviorSubject<any>(undefined);
    constructor(private api: Api) {}

    validate(purchaseOrder: string, productLine: any, location: any) {
        return this.api.get("/v4/sm/purchaseorders/" + purchaseOrder + "/validate?productLine=" + productLine.productLineId + "&jobsiteId=" + location.shipmentLocationId);
    }

    all() {
        return this.api.get("/v1/im/salesdocumenttypes");
    }

    // Documents types
    getDocument(code: string) {
        const documents: Array<any> = this.salesDocuments.getValue();
        if (documents) {
            return documents.find((item) => {
                return item.salesDocumentTypeCode === code;
            });
        }
    }

    // Run this after login only
    fetchSalesDocuments() {
        this.all().subscribe((response) => {
            this.salesDocuments.next(response.json().salesDocumentTypes);
        });
    }
}