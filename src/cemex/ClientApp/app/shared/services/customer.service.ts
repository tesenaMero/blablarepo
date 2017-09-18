import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class CustomerService {
    customerSubject = new BehaviorSubject<any>(undefined);
    availableCustomers = [];

    constructor() {}

    setCustomer(entity: any) {
        this.customerSubject.next(entity);
    }

    setAvailableCustomers(enitities: any[]) {
        this.availableCustomers = enitities;
    }

    currentCustomer() {
        return this.customerSubject.getValue();
    }
}
