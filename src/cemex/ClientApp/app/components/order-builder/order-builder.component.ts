import { Component, ViewChild, ChangeDetectorRef, NgZone, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router } from '@angular/router'
import { StepperComponent } from '../../shared/components/stepper/';
import { DeliveryMode } from '../../models/delivery.model';
import { DashboardService } from '../../shared/services/dashboard.service';
import { DraftsService } from '../../shared/services/api';
import { CustomerService } from '../../shared/services/customer.service';
import { CreateOrderService } from '../../shared/services/create-order.service';
import { EncodeDecodeJsonObjService } from '../../shared/services/encodeDecodeJsonObj.service';
import { ModalService } from '../../shared/components/modal'
import { Validations } from '../../utils/validations'
import { TranslationService } from '../../shared/services/translation.service'

@Component({
    selector: 'order-builder',
    templateUrl: './order-builder.html',
    styleUrls: ['./order-builder.scss']
})
export class OrderBuilderComponent {
    @ViewChild(StepperComponent) stepper;
    private isReadyMix: boolean = false;
    private isBulkCementUSA: boolean = false;
    private rebuildOrder = false;
    private currentCustomer: any;

    private draftId: any;
    private draftOrder: any;

    private orderCode: any;

    private cashOrders: any[] = [];
    private creditOrders: any[] = [];

    constructor(
        @Inject(DOCUMENT) private document: any,
        private _changeDetector: ChangeDetectorRef,
        private router: Router,
        private dashboard: DashboardService,
        private drafts: DraftsService,
        private customerService: CustomerService,
        private manager: CreateOrderService,
        private zone: NgZone,
        private jsonObjService: EncodeDecodeJsonObjService,
        private modal: ModalService,
        private t: TranslationService) {

        this.rebuildOrder = false;
        this.customerService.customerSubject.subscribe((customer) => {
            Validations.init(this.manager, this.customerService);
            if (customer && customer != this.currentCustomer) {
                this.currentCustomer = customer;
                this.rebuild();
            }
        });
    }

    // Rebuilds the component
    rebuild() {
        this.manager.resetOrder();

        // Go into js event loop
        setTimeout(() => { this.rebuildOrder = false; }, 0);
        setTimeout(() => { this.rebuildOrder = true; }, 0);
    }

    // Steps events
    // ------------------------------------------------------------
    modeStepCompleted(mode: DeliveryMode) {
        if (mode) {
            this.stepper.complete();
        }
        else { this.stepper.uncomplete(); }
    }

    productStepCompleted(product: any) {
        this.isReadyMix = Validations.isReadyMix();
        this.isBulkCementUSA = (Validations.isBulkCement()) && (Validations.isUSACustomer());
        this._changeDetector.detectChanges();
        this.stepper.complete();
    }

    locationStepCompleted(event: any) {
        if (event) { this.stepper.complete(); }
        else { this.stepper.uncomplete(); }
    }

    locationStepRequestedNext(event: any) {
        this.stepper.complete();
        this.stepper.next(true);
    }

    specificationsStepCompleted(event: any) {
        if (event) {
            this.stepper.complete();
        }
        else {
            this.stepper.uncomplete();
        }
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

    checkoutCompleted(draftOrder?: any) {
        if (draftOrder) {
            this.draftOrder = draftOrder;
            this.stepper.complete();
        }
        else {
            if (Validations.isUSACustomer()) { this.stepper.complete(); }
            else if (Validations.isMexicoCustomer() && Validations.isReadyMix()) {
                this.stepper.complete();
            }
            else { this.stepper.uncomplete(); }
        }
    }

    finishSteps() {
        this.placeOrder();
    }

    // Payment flow
    // --------------------------------------------------------------------
    placeOrder() {
        if ((Validations.isMexicoCustomer()) && (!this.isReadyMix)) {
            this.dashboard.alertInfo(this.t.pt('views.common.placing') + " " + this.draftOrder.orderId, 0);

            this.cashOrders = this.getCashOrders();
            this.creditOrders = this.getCreditOrders();

            // Pay credit orders
            if (this.creditOrders.length) {
                if ((!this.isReadyMix) && (Validations.isMexicoCustomer())) {
                    this.flowCementMX();
                }
                else {
                    this.basicFlow();
                }
            }

            // Pay cash orders only
            else if (this.cashOrders.length) {
                this.flowMidCash(this.cashOrders);
            }
        }
        else {
            this.basicFlow();
        }
    }

    flowMidCash(cashOrders: any[]) {
        const customer = this.customerService.currentCustomer();
        let data = [];

        cashOrders.forEach(item => {
            data.push({
                orderID: this.draftOrder.orderId,
                companyCode: this.draftOrder.salesArea.salesOrganizationCode,
                customerCode: customer.legalEntityTypeCode,
                jobSiteCode: this.draftOrder.jobsite.jobsiteCode,
                payerCode: customer.legalEntityTypeCode,
                orderAmount: item.totalPrice,
                documents: []
            })
        });

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

        let encoded = this.jsonObjService.encodeJson(cartItems);
        this.document.location.href = 'https://dcm-qa.mybluemix.net/invoices-payments/open/' + encoded;
    }

    flowCementMX() {
        this.drafts.createOrder(this.draftId, '')
            .flatMap((response) => {
                this.dashboard.alertSuccess(this.t.pt('views.common.credit') + " " + this.t.pt('views.common.requesting_code'), 0);
                return this.drafts.validateRequestId(response.json().id);
            })
            .subscribe((response) => {
                this.dashboard.alertSuccess(this.t.pt('views.common.credit') + " " +  this.t.pt('views.common.order_code') + response.json().orderCode + " " + this.t.pt('views.common.placed_success'), 30000);
                this.showSuccessModal(response.json().orderCode);
            }, error => {
                this.dashboard.alertError(this.t.pt('views.common.error_placing'), 10000);
            })
    }

    basicFlow() {
        this.drafts.createOrder(this.draftId, '').subscribe((response) => {
            if (this.draftOrder) {
                this.dashboard.alertInfo(this.t.pt('views.common.placing') + " " + this.draftOrder.orderId);
                this.dashboard.alertSuccess(this.t.pt('views.common.order') + this.draftOrder.orderId + " " + this.t.pt('views.common.placed_success'), 30000);
                this.showSuccessModal(this.draftOrder.orderId);
            }
            else {
                this.dashboard.alertSuccess(this.t.pt('views.common.draft') + this.draftId + " " + this.t.pt('views.common.placed_success'), 30000);
                this.showSuccessModal(this.draftId);
            }
        }, error => {
            this.dashboard.alertError(this.t.pt('views.common.error_placing'), 10000);
        });
    }

    // In-class utils
    // ---------------------------------------------------------------
    getCashOrders(): any[] {
        return this.draftOrder.items.filter((item) => {
            return item.paymentTerm && item.paymentTerm.paymentTermCode == "ZCON";
        });
    }

    getCreditOrders(): any[] {
        return this.draftOrder.items.filter((item) => {
            return item.paymentTerm && item.paymentTerm.paymentTermCode == "Z015";
        });
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

    showSuccessModal(orderCode) {
        this.orderCode = orderCode;
        this.modal.open('success-placement');
    }

    closeModal() {
        this.router.navigate(['/app/orders']);
        this.modal.close('success-placement');
    }

    payCashOrders() {
        this.modal.close('success-credit');
        this.flowMidCash(this.cashOrders);
    }
}
