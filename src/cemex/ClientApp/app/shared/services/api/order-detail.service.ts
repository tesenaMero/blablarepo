import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Api } from './api.service';
import { CustomerService } from '../customer.service'

@Injectable()
export class OrderDetailApi {
    constructor(private api: Api, private customerService: CustomerService) {
    }

    byIdType(orderId: number, orderType: string): Observable<Response> {
        return this.api.get("/v4/sm/orders/" + orderId + "?orderType=" + orderType);
    }

    shipmentLocationsJob(jobsiteId): Observable<Response> { //US & MX -> Jobsite
        this.customerService.customerSubject.subscribe((response) => {
            // console.log("async", response);
        });
        const customerId = this.customerService.currentCustomer().legalEntityId;
        // console.log("/v4/sm/myshipmentlocations?legalEntityId=" + customerId + ".1&shipmentLocationId=" + jobsiteId + ".2&shipmentLocationTypeId=2");
        return this.api.get("/v4/sm/myshipmentlocations?legalEntityId=" + customerId + ".1&shipmentLocationId=" + jobsiteId + ".2&shipmentLocationTypeId=2");
    }

    shipmentLocationsPOD(pod): Observable<Response> { //MX -> Point Of Delivery
        this.customerService.customerSubject.subscribe((response) => {
            // console.log("async", response);
        });
        const customerId = this.customerService.currentCustomer().legalEntityId;
        // console.log("/v4/sm/myshipmentlocations?legalEntityId=" + customerId + ".1&shipmentLocationId=" + pod + ".3&shipmentLocationTypeId=3");
        return this.api.get("/v4/sm/myshipmentlocations?legalEntityId=" + customerId + ".1&shipmentLocationId=" + pod + ".3&shipmentLocationTypeId=3");
    }

    shipmentLocationsStreet(street): Observable<Response> { //MX -> Point Of Delivery
        this.customerService.customerSubject.subscribe((response) => {
            // console.log("async", response);
        });
        const customerId = this.customerService.currentCustomer().legalEntityId;
        // console.log("/v4/sm/addresses/" + street);
        return this.api.get("/v4/sm/addresses/" + street);
    }

    validateRequestId(id) {
        return this.api.get("/v4/sm/orders/" + id + "?orderType=SLS");
    }
}
