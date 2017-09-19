import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SessionService } from '@cemex-core/angular-services-v2/dist';

@Injectable()
export class CustomerService {
    customerSubject = new BehaviorSubject<any>(undefined);
    availableCustomers = [];

    constructor(private session: SessionService) {
        this.session.currentLegalEntity.subscribe((customer) => {
            if (customer) {
                this.setCustomer(customer);
            }
        });
    }

    setCustomer(entity: any) {
        sessionStorage.setItem('currentCustomer', JSON.stringify(entity));
        this.customerSubject.next(entity);
    }

    setAvailableCustomers(enitities: any[]) {
        this.availableCustomers = enitities;
    }

    currentCustomer() {
        return this.customerSubject.getValue();
    }
}
