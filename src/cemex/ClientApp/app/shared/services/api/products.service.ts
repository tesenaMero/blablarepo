import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class ProductsApi {
    constructor(private api: Api) {
    }

    // 'https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev/v2/mm/myproducts?shipmentLocationId=59.5&salesDocumentTypeId=3&productLineId=2'
    // 'https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev/v2/mm/myproducts?salesDocumentTypeId=3&productLineId=1&shippingConditionId=1&shipmentLocationId=253.2'
    // 'https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev/v2/mm/myproducts?salesDocumentTypeId=3&productLineId=1&shippingConditionId=1&shipmentLocationId=253.2&PONumber=123A'
    top(jobsite, salesDocumentTypeId, productLine, shippingCondition, purchaseOrder?): Observable<Response> {
        if (purchaseOrder === undefined) {
            return this.api.get(`/v2/mm/myproducts?salesDocumentTypeId=${salesDocumentTypeId}&productLineId=${productLine.productLineId}&shippingConditionId=${shippingCondition.shippingConditionId}&shipmentLocationId=${jobsite.shipmentLocationId}.2`);
        }
        else {
            return this.api.get(`/v2/mm/myproducts?salesDocumentTypeId=${salesDocumentTypeId}&productLineId=${productLine.productLineId}&shippingConditionId=${shippingCondition.shippingConditionId}&shipmentLocationId=${jobsite.shipmentLocationId}.2&PONumber=${purchaseOrder}`);
        }
    }

    fetchContracts(jobsite, salesDocumentTypeId, productLine, shippingCondition, productId): Observable<Response> {
        // '/v2/mm/myproducts?salesDocumentTypeId=1&shippingConditionId=1&shipmentLocationId=815.2&productId=1536'
        return this.api.get(`/v2/mm/myproducts?productId=${productId}&salesDocumentTypeId=${salesDocumentTypeId}&shippingConditionId=${shippingCondition.shippingConditionId}&shipmentLocationId=${jobsite.shipmentLocationId}.2`);
    }

    byProductColorAndSalesDocumentAndPlant(salesDocumentTypeId, productColorId, plantId?): Observable<Response> {
        return this.api.get(`/v2/mm/myproducts?${(plantId === void 0) ? `` : `plantId=${plantId}&`}salesDocumentTypeId=${salesDocumentTypeId}&productColorId=${productColorId}`);
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