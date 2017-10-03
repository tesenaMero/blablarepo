import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Api } from './api.service';

@Injectable()
export class PaymentTermsApi {
    constructor(private api: Api) {
    }

    getJobsiteById(termId: any) {
        return this.api.get(`/v1/im/paymentterms?paymentTermId=${termId}`);
    }
    
    getJobsitePaymentTerms(termId: any) {
        return this.api.get(`/v1/im/paymentterms?paymentTermId=${termId}`);
    }
    
    getCashTerm(customerId: number) {
        return this.api.get(`/v1/im/paymentterms?customerId=${customerId}&paymentTermCode=ZCON`);
    }

    getCreditTerm(customerId: number) {
        return this.api.get(`/v1/im/paymentterms?customerId=${customerId}&paymentTermCode=CRED`);
    }
}