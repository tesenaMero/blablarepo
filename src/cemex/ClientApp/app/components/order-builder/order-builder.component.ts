import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router'
import { StepperComponent } from '../../shared/components/stepper/';
import { DeliveryMode } from '../../models/delivery.model';
import { DashboardService } from '../../shared/services/dashboard.service'
import { DraftsService } from '../../shared/services/api/drafts.service'

@Component({
    selector: 'order-builder',
    templateUrl: './order-builder.html',
    styleUrls: ['./order-builder.scss']
})
export class OrderBuilderComponent {
    @ViewChild(StepperComponent) stepper;
    private READYMIX_ID = 6;
    private isReadyMix: boolean = false;

    constructor(private _changeDetector: ChangeDetectorRef, private router: Router, private dashboard: DashboardService, private drafts: DraftsService) { }

    modeStepCompleted(mode: DeliveryMode) {
        this.stepper.complete();
    }

    locationStepCompleted(event: any) {
        this.stepper.complete();
    }

    productStepCompleted(product: any) {
        this.isReadyMix = product.productLineId == this.READYMIX_ID;
        this._changeDetector.detectChanges();
        this.stepper.complete();
    }

    summaryStepCompleted() {
        this.stepper.complete();
    }

    specificationsStepShowed() {
        this.stepper.complete();
    }

    finishSteps() {
        this.dashboard.alertInfo("Saving draft...");
        this.drafts.add(this.uglyOrder()).subscribe((response) => {
            this.dashboard.alertSuccess("Draft saved!");
            this.router.navigate(['/app/cart']);
        });
    }

    private uglyOrder() {
        return { "orderId": 0, "orderCode": "", "orderName": "Cement Online Order", "createdDateTime": "2017-09-07T15:00:00.000Z", "updatedDateTime": "2017-09-07T15:00:00.000Z", "programmedDateTime": "2017-09-07T15:00:00.000Z", "requestedDateTime": "2017-09-10T15:00:00.000Z", "draftDateTime": "2017-09-07T14:28:18.814Z", "purchaseOrder": "PO_JVC", "status": {  "statusId": 1 }, "salesArea": {  "salesAreaId": 2 }, "orderType": {  "orderTypeId": 8 }, "customer": {  "customerId": 122 }, "shippingCondition": {  "shippingConditionId": 1 }, "jobsite": {  "jobsiteId": 59 }, "pointOfDelivery": {  "pointOfDeliveryId": 393 }, "instructions": "Instrucciones de entrega", "contact": {  "contactId": "2298",  "contactName": "Contact",  "contactPhone": "Contact" }, "user": {  "userId": 50 }, "items": [{   "orderItemId": 0,   "itemSeqNum": 10,   "purchaseOrder": "PO_JVC",   "requestedDateTime": "2017-09-05T14:28:18.814Z",   "programmedDateTime": "2017-09-05T14:28:18.814Z",   "currency": {    "currencyId": 1   },   "quantity": 50,   "product": {    "productId": 1629   },   "uom": {    "unitId": 262   },   "paymentTerm": {    "paymentTermId": 43   },   "shippingSource": {    "shippingSourceId": 387   },   "orderItemProfile": {    "transportMethod": {     "transportMethodId": 26    },    "additionalServices": [{      "additionalServiceId": 4     }    ]   }  } ]}
    }
}
