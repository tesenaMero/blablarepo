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
        const customerId = this.customer.currentCustomer();
        if (customerId) {
            return this.api.get("/v4/sm/productlines?customerId=" + customerId.legalEntityId);
        }
    }

}