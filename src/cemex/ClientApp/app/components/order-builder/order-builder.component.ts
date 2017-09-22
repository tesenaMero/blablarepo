import { Component, ViewChild, ChangeDetectorRef, NgZone, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router } from '@angular/router'
import { StepperComponent } from '../../shared/components/stepper/';
import { DeliveryMode } from '../../models/delivery.model';
import { DashboardService } from '../../shared/services/dashboard.service';
import { DraftsService } from '../../shared/services/api/drafts.service';
import { CustomerService } from '../../shared/services/customer.service';
import { CreateOrderService } from '../../shared/services/create-order.service';
import { EncodeDecodeJsonObjService } from '../../shared/services/encodeDecodeJsonObj.service';

@Component({
    selector: 'order-builder',
    templateUrl: './order-builder.html',
    styleUrls: ['./order-builder.scss']
})
export class OrderBuilderComponent {
    @ViewChild(StepperComponent) stepper;
    private READYMIX_ID = 6;
    private BULKCEMENT_ID = 1;
    private isReadyMix: boolean = false;
    private isBulkCementUSA: boolean = false;
    private rebuildOrder = false;
    private currentCustomer: any;

    private draftId: any;
    private draftOrder: any;

    constructor(
        private _changeDetector: ChangeDetectorRef,
        private router: Router,
        private dashboard: DashboardService,
        private drafts: DraftsService,
        private customerService: CustomerService,
        private manager: CreateOrderService,
        private zone: NgZone,
        private jsonObjService: EncodeDecodeJsonObjService, 
        @Inject(DOCUMENT) private document: any) {
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
        this.isReadyMix = product.productLineId == this.READYMIX_ID;
        this.isBulkCementUSA = (product.productLineId == this.BULKCEMENT_ID) && (this.currentCustomer.countryCode.trim() == "US");
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

    checkoutCompleted(draftOrder) {
        if (draftOrder) {
            console.log("order", draftOrder);
            this.draftOrder = draftOrder;
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
        console.log("finish", this.draftOrder);
        this.placeOrder();
    }

    placeOrder() {
        this.dashboard.alertInfo("Placing order " + this.draftOrder.orderId, 0);
        const customer = this.customerService.currentCustomer();
        let data = [];

        this.draftOrder.items.forEach(item => {
            data.push({
                    orderID: this.draftOrder.orderId,
                    companyCode: this.draftOrder.salesArea.salesOrganizationCode,
                    customerCode: customer.legalEntityTypeCode,
                    jobSiteCode: this.draftOrder.jobsite.jobsiteCode,
                    payerCode: customer.legalEntityTypeCode,
                    orderAmount: item.totalPrice,
                    documents: []
                }
            )
        })
        
        const cartItems = {
            sourceApp: "order-taking",
            date: new Date().toISOString(),
            screenToShow: "cash-sales",
            credentials: {
                token: sessionStorage.getItem('access_token'),
                jwt: sessionStorage.getItem('jwt')
            },
            data: data
        }
        
        if ((!this.isReadyMix) && (this.isMexico())) {
            this.drafts.createOrder(this.draftId, '')
            .flatMap((response) => {
                console.log("order created", response.json());
                this.dashboard.alertSuccess("Order placed successfully, requesting order code...", 0);
                return this.drafts.validateRequestId(response.json().id);
            })
            .subscribe((response) => {
                this.dashboard.alertSuccess("Order code:" + response.json().orderCode + " placed successfully", 30000);
            }, error => {
                this.dashboard.alertError("Error placing order", 10000);
            })
        }
        else {
            this.drafts.createOrder(this.draftId, "").subscribe((response) => {
                console.log("order created", response.json());
                this.dashboard.alertInfo("Placing order " + this.draftOrder.orderId);
                this.dashboard.alertSuccess("Order #" + this.draftOrder.orderId + " placed successfully", 30000);
            }, 
            error => {
                console.error(error)
                this.dashboard.alertError("Error placing order", 10000);
            });
    
        }

        let encoded = this.jsonObjService.encodeJson(cartItems);
        // this.document.location.href = 'https://invoices-payments-dev2.mybluemix.net/invoices-payments/open/' + encoded;
    }

    isMexico() {
        return this.customerService.currentCustomer().countryCode.trim() == "MX";
    }

    shouldShowDeliveryMode() {
        if (this.isReadyMix) {
            return false;
        }
        else if (this.isBulkCementUSA) {
            return false;
        }
        else {
            return true;
        }
    }
}
