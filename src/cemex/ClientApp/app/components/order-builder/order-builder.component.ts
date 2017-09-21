import { Component, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router'
import { StepperComponent } from '../../shared/components/stepper/';
import { DeliveryMode } from '../../models/delivery.model';
import { DashboardService } from '../../shared/services/dashboard.service';
import { DraftsService } from '../../shared/services/api/drafts.service';
import { CustomerService } from '../../shared/services/customer.service';
import { CreateOrderService } from '../../shared/services/create-order.service';

@Component({
    selector: 'order-builder',
    templateUrl: './order-builder.html',
    styleUrls: ['./order-builder.scss']
})
export class OrderBuilderComponent {
    @ViewChild(StepperComponent) stepper;
    private READYMIX_ID = 6;
    private isReadyMix: boolean = false;
    private rebuildOrder = false;
    private currentCustomer: any;

    private draftId: any;

    constructor(
        private _changeDetector: ChangeDetectorRef,
        private router: Router,
        private dashboard: DashboardService,
        private drafts: DraftsService,
        private customerService: CustomerService,
        private manager: CreateOrderService,
        private zone: NgZone) {
        this.rebuildOrder = false;
        this.customerService.customerSubject.subscribe((customer) => {
            if (customer && customer != this.currentCustomer) {
                this.currentCustomer = customer;
                this.rebuild();
            }
        });
    }

    rebuild() {
        // Add instruction to event queue
        this.manager.resetOrder();
        setTimeout(() => { this.rebuildOrder = false; }, 0);
        setTimeout(() => { this.rebuildOrder = true; }, 0);
    }

    modeStepCompleted(mode: DeliveryMode) {
        this.stepper.complete();
    }

    locationStepCompleted(event: any) {
        if (event)
            this.stepper.complete();
        else
            this.stepper.uncomplete();
    }

    locationStepRequestedNext(event: any) {
        this.stepper.complete();
        this.stepper.next(true);
    }

    productStepCompleted(product: any) {
        console.log("completed");
        this.isReadyMix = product.productLineId == this.READYMIX_ID;
        this._changeDetector.detectChanges();
        this.stepper.complete();
    }

    reviewStepCompleted(draftId) {
        if (draftId) {
            this.draftId = draftId;
            this.stepper.complete();
        }
        else {
            this.stepper.uncomplete();
        }
    }

    checkoutCompleted(event) {
        if (event) {
            this.stepper.complete();
        }
        else {
            this.stepper.uncomplete();
        }
    }

    specificationsStepShowed() {
        this.stepper.complete();
    }

    specificationsStepCompleted(event: any) {
        if (event) {
            this.stepper.complete();
        }
        else {
            this.stepper.uncomplete();
        }
    }

    finishSteps() {
    }
}
