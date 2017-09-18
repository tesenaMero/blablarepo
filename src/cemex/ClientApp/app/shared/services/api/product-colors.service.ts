import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Api } from './api.service';
import { CustomerService } from '../customer.service'

@Injectable()
export class ProductColorApi {

    constructor(private api: Api, private customerService: CustomerService) {}
    
    productColors(productLineId: number): Observable<Response> {
        const customerId = 122;//this.customerService.currentCustomer().legalEntityId;
        return this.api.get(`/v2/mm/productcolors?productLineId=${productLineId}&legalEntityId=${customerId}.1`);
    }
}