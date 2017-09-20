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
}