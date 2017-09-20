import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Api } from './api.service';

@Injectable()
export class PaymentTermsApi {
    constructor(private api: Api) {
    }

    getJobsitePaymentTerms(termId: any) {
        return this.api.get(`/v1/im/paymentterms?paymentTermId=${termId}`);
    }
    getCashTerm(customerId: number) {
        `/v1/im/paymentterms?customerId=${customerId}&paymentTermCode=ZCON`
        return this.api.get(`/v1/im/paymentterms?customerId=122&paymentTermCode=ZCON`);
    }
}