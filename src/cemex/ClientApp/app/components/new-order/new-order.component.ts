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

    // Lang 
    private subLang: Subscription;
    private language: any
    
    constructor(
        private t: TranslationService,
        private customerService: CustomerService,
        private manager: CreateOrderService
    ) {
        this.rebuildOrder = false;
        this.sub = this.customerService.customerSubject.subscribe((customer) => {
            if (customer) {
                if (!this.currentCustomer) {
                    this.currentCustomer = customer;
                    this.rebuild();
                }
                else { // Validate if is the same legal entity
                    if (customer.legalEntityTypeCode && this.currentCustomer.legalEntityTypeCode != this.currentCustomer.legalEntityTypeCode) {           
                        this.currentCustomer = customer;
                        this.rebuild();
                    }
                }
            }
        });
        
        // Listen to language change
        this.subLang = this.t.localeData.subscribe(response => {
            // If its different from the already selected language
            if (this.language != response.lang) {
                this.language = response.lang;
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
