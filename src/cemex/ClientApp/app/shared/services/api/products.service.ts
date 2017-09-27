import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class ProductsApi {
    constructor(private api: Api) {
    }

    top(jobsite, salesDocumentTypeId, productLine, shippingCondition, purchaseOrder?): Observable<Response> {
        if (purchaseOrder === undefined) {
            return this.api.get(`/v2/mm/myproducts?salesDocumentTypeId=${salesDocumentTypeId}&productLineId=${productLine.productLineId}&shippingConditionId=${shippingCondition.shippingConditionId}&shipmentLocationId=${jobsite.shipmentLocationId}.2`);
        }
        else {
            return this.api.get(`/v2/mm/myproducts?salesDocumentTypeId=${salesDocumentTypeId}&productLineId=${productLine.productLineId}&shippingConditionId=${shippingCondition.shippingConditionId}&shipmentLocationId=${jobsite.shipmentLocationId}.2&PONumber=${purchaseOrder}`);
        }
    }

    fetchContracts(jobsite, salesDocumentTypeId, productLine, shippingCondition, productId): Observable<Response> {
        return this.api.get(`/v2/mm/myproducts?productId=${productId}&salesDocumentTypeId=${salesDocumentTypeId}&shippingConditionId=${shippingCondition.shippingConditionId}&shipmentLocationId=${jobsite.shipmentLocationId}.2`);
    }

    byProductColorAndSalesDocumentAndPlant(salesDocumentTypeId, productColorId, plantId?): Observable<Response> {
        return this.api.get(`/v2/mm/myproducts?${(plantId === void 0) ? `` : `plantId=${plantId}&`}salesDocumentTypeId=${salesDocumentTypeId}&productColorId=${productColorId}`);
    }

    advancedSearch(shipmentLocationId): Observable<Response> {
        return this.api.get(`/v2/mm/myproducts?shipmentLocationId=${shipmentLocationId}.2&salesDocumentTypeId=5&productLineId=1`);
    }

    units(productId: any): Observable<Response> {
        return this.api.get(`/v2/mm/productunitconversions?productId=${productId}`);
    }

    unit(product: any): Observable<Response> {
        return this.api.get(product.unitOfMeasure.links.self);
    }

    unitByUnitOfMeasure(unitOfMeasure: any): Observable<Response> {
        return this.api.get(unitOfMeasure.links.self);
    }

    salesAreaFromContract(contract: any): Observable<Response> {
        return this.api.get(contract.links.salesDocument);
    }
}