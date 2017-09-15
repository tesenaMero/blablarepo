import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class ProductsApi {
    constructor(private api: Api) {
    }

    top(jobsite, salesDocumentTypeId, productLine, shippingCondition): Observable<Response> {
        // 'https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev/v2/mm/myproducts?shipmentLocationId=59.5&salesDocumentTypeId=3&productLineId=2'
        // 'https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev/v2/mm/myproducts?salesDocumentTypeId=3&productLineId=1&shippingConditionId=1&shipmentLocationId=253.2'
        return this.api.get(`/v2/mm/myproducts?salesDocumentTypeId=${salesDocumentTypeId}&productLineId=${productLine.productLineId}&shippingConditionId=${shippingCondition.shippingConditionId}&shipmentLocationId=${jobsite.shipmentLocationId}.2`);
    }

    fetchContracts(jobsite, salesDocumentTypeId, productLine, shippingCondition, productId): Observable<Response> {
        // '/v2/mm/myproducts?salesDocumentTypeId=1&shippingConditionId=1&shipmentLocationId=815.2&productId=1536'
        return this.api.get(`/v2/mm/myproducts?productId=${productId}&salesDocumentTypeId=${salesDocumentTypeId}&shippingConditionId=${shippingCondition.shippingConditionId}&shipmentLocationId=${jobsite.shipmentLocationId}.2`);
    }

    // units(product: any): Observable<Response> {
    //     return this.api.get(product.unitOfMeasure.links.self);
    // }

    advancedSearch(shipmentLocationId): Observable<Response> {
        return this.api.get(`/v2/mm/myproducts?shipmentLocationId=${shipmentLocationId}.2&salesDocumentTypeId=5&productLineId=1`);
    }

    units(productId: any): Observable<Response> {
        return this.api.get(`/v2/mm/productunitconversions?productId=${productId}`);
    }
}