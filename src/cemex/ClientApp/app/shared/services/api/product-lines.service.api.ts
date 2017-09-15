import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { CustomerService } from '../customer.service'

import { Api } from './api.service';

@Injectable()
export class ProductLineApi {
    constructor(private api: Api, private customer: CustomerService) {
    }

    all(): Observable<Response> {
        let user = sessionStorage.getItem('user_customer');
        let customerId = this.customer.currentCustomer();
        if (customerId)
            return this.api.get("/v4/sm/productlines?customerId=" + customerId.legalEntityId);
        else
            return this.api.get("/v4/sm/productlines?customerId=" + 354);
    }

}