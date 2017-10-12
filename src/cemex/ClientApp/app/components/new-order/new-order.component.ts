import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';
import { Subscription } from 'rxjs/Subscription';
import { CreateOrderService } from '../../shared/services/create-order.service';
import { CustomerService } from '../../shared/services/customer.service';

@Component({
    selector: 'new-order',
    templateUrl: './new-order.html',
    styleUrls: ['./new-order.scss']
})
export class NewOrderComponent implements OnInit, OnDestroy {
    private rebuildOrder = false;
    private sub: Subscription;
    private currentCustomer: any;

    constructor(
        private t: TranslationService,
        private customerService: CustomerService,
        private manager: CreateOrderService
    ) {
        this.rebuildOrder = false;
        this.sub = this.customerService.customerSubject.subscribe((customer) => {
            if (customer && customer != this.currentCustomer) {
                this.currentCustomer = customer;
                this.rebuild();
            }
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        this.manager.resetOrder();
        this.sub.unsubscribe();
    }

    // Rebuilds the component
    rebuild() {
        this.manager.resetOrder();

        // Go into js event loop
        setTimeout(() => { this.rebuildOrder = false; }, 0);
        setTimeout(() => { this.rebuildOrder = true; }, 0);
    }
}
