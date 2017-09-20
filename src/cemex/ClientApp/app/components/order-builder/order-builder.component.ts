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
        this.isReadyMix = product.productLineId == this.READYMIX_ID;
        this._changeDetector.detectChanges();
        this.stepper.complete();
    }

    summaryStepCompleted() {
        this.stepper.complete();
        this.dashboard.alertInfo("Saving draft...");
        this.drafts.add(this.uglyOrder()).subscribe((response) => {
            const res = response.json();
            console.log('drafts.add -> ', res);
            this.drafts.draftId(res.id);
            this.dashboard.alertSuccess("Draft saved!");
        });
    }

    specificationsStepShowed() {
        this.stepper.complete();
    }

    specificationsStepCompleted() {
        this.stepper.complete();
    }

    finishSteps() {
        this.router.navigate(['/app/cart']);
    }

    private uglyOrder() {
        const orderService = this.manager
        return {
            "orderName": "Cement Bag Online Order",
            "requestedDateTime": "2017-09-20T15:00:00.000Z",
            "purchaseOrder": "PO_JVCM",
            "salesArea": {
                "salesAreaId": 2
            },
            "customer": {
                "customerId": 122
            },
            "shippingCondition": {
                "shippingConditionId": 1
            },
            "jobsite": {
                "jobsiteId": 59
            },
            "pointOfDelivery": {
                "pointOfDeliveryId": 393
            },
            "instructions": "Instrucciones de entrega",
            "contact": {
                "contactName": "Ivan el Terrible",
                "contactPhone": "821920192102"
            },
            "items": [
                {
                    "itemSeqNum": 10,
                    "purchaseOrder": "PO_JVCM",
                    "requestedDateTime": "2017-09-05T14:28:18.814Z",
                    "currency": {
                        "currencyCode": "MXN"
                    },
                    "quantity": 50,
                    "product": {
                        "productId": 1629
                    },
                    "uom": {
                        "unitId": 262
                    },
                    "paymentTerm": {
                        "paymentTermId": 43
                    },
                    "orderItemProfile": {
                        "additionalServices": [
                            {
                                "additionalServiceCode": "MANEUVERING"
                            }
                        ]
                    }
                }
            ]
        }
    }
}
