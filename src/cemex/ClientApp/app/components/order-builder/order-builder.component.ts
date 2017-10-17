import { Component, ViewChild, ChangeDetectorRef, NgZone, Inject, OnDestroy, Input } from '@angular/core';
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
import { Subscription } from 'rxjs/Subscription';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';

let CircularJSON = require('circular-json');

@Component({
    selector: 'order-builder',
    templateUrl: './order-builder.html',
    styleUrls: ['./order-builder.scss']
})
export class OrderBuilderComponent implements OnDestroy {
    @ViewChild(StepperComponent) stepper: StepperComponent;
    @Input() restoreOrder? = false;

    private messages: any[] = [];

    private isReadyMix: boolean = false;
    private isBulkCementUSA: boolean = false;

    private draftId: any;
    private draftOrder: any;

    private orderCode: any;

    private cashOrders: any[] = [];
    private creditOrders: any[] = [];

    private sub: Subscription;

    private pl_step_name = this.t.pt('views.builder.product_line');
    private location_step_name = this.t.pt('views.builder.location');
    private specifications_step_name = this.t.pt('views.builder.specifications');
    private review_step_name = this.t.pt('views.builder.review');
    private summary_step_name = this.t.pt('views.builder.summary');

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

        Validations.init(this.manager, this.customerService);
    }

    // Content children are set
    stepperRendered() {
        // Rebuild builder state from manager if any
        let managerJSON = localStorage.getItem('manager');
        if (managerJSON) { this.rebuildManager(managerJSON); }
    }

    ngOnDestroy(): void {
    }

    rebuildManager(managerJSON) {
        let restoredManager =  CircularJSON.parse(managerJSON) as CreateOrderService;
        
        // restoredManager.restored = true;
        // this.manager.restored = restoredManager.restored;
        this.manager.jobsite = restoredManager.jobsite;
        this.manager.draftId = restoredManager.draftId;
        this.manager.pointOfDelivery = restoredManager.pointOfDelivery || undefined;
        this.manager.productLine = restoredManager.productLine;
        this.manager.products = restoredManager.products;
        this.manager.salesArea = restoredManager.salesArea;
        this.manager.shippingCondition = restoredManager.shippingCondition;
        this.manager.contact = restoredManager.contact || undefined;
        this.manager.purchaseOrder = restoredManager.purchaseOrder || undefined;
        this.manager.instructions = restoredManager.instructions || undefined;
        this.manager.isPatched = restoredManager.isPatched || false;
        
        // Go to last step step
        this.stepper.goToLastStep();
        //this.stepper.selectStep(this.stepper.steps.last)
        // this.stepper.steps.forEach((step, index) => {
        //     // If last
        //     if (index === this.stepper.steps.length - 1) { this.stepper.selectStep(step) }
        //     else {
        //         console.log("completing step ", index);
        //         step.completed = true;
        //         step.active = false;
        //     }
        // })

        localStorage.removeItem('manager');
    }

    // Steps events
    // ------------------------------------------------------------
    modeStepCompleted(mode: DeliveryMode) {
        if (mode) {
            this.stepper.complete();
        }
        else { this.stepper.uncomplete(); }
    }

    productStepCompleted(productLine: any) {
        if (productLine) {
            this.isReadyMix = Validations.isReadyMix();
            this.isBulkCementUSA = (Validations.isBulkCement()) && (Validations.isUSACustomer());
            this._changeDetector.detectChanges();
            this.stepper.complete();
        }
        else {
            this.stepper.uncomplete();
        }
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
        this.stepper.uncomplete();
        this.placeOrder();
    }

    getManagerState() {
        let cache = [];
        JSON.stringify(this.manager, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                // If circular, discard key
                if (cache.indexOf(value) !== -1) { return; }
                cache.push(value);
            }
            return value;
        });

        // GC
        cache = null;
    }

    // Payment flow
    // --------------------------------------------------------------------
    placeOrder() {
        // Save manager in localstroage allowing 
        localStorage.setItem('manager', CircularJSON.stringify(this.manager))

        if (Validations.isMexicoCustomer() && Validations.isCement()) {
            this.dashboard.alertInfo(this.t.pt('views.common.placing') + " " + this.draftOrder.orderId, 0);

            this.cashOrders = this.getCashOrders();
            this.creditOrders = this.getCreditOrders();

            // Pay credit orders
            if (this.cashOrders.length) {
                this.flowMidCash(this.cashOrders);
            }
            else if (this.creditOrders.length) {
                this.flowCementMX();
            }
        }
        else {
            this.basicFlow();
        }
    }

    flowMidCash(cashOrders: any[]) {
        const customer = this.customerService.currentCustomer();
        let data = [];

        let orderAmount = 0;
        cashOrders.forEach((item) => {
            orderAmount += item.totalPrice;
        });

        data.push({
            orderID: this.draftOrder.orderId,
            companyCode: this.draftOrder.salesArea.salesOrganizationCode,
            customerCode: customer.legalEntityTypeCode,
            jobSiteCode: this.draftOrder.jobsite.jobsiteCode,
            payerCode: customer.legalEntityTypeCode,
            orderAmount: orderAmount,
            documents: []
        })

        const cartItems = {
            sourceApp: "order-taking",
            date: new Date().toISOString(),
            screenToShow: "cash-sales",
            credentials: {
                token: sessionStorage.getItem('access_token'),
                jwt: sessionStorage.getItem('jwt'),
                refresh_token: sessionStorage.getItem('refresh_token')
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
                this.dashboard.alertSuccess(this.t.pt('views.common.credit') + " " + this.t.pt('views.common.order_code') + response.json().orderCode + " " + this.t.pt('views.common.placed_success'), 30000);

                // Remove first three and last three chars and split messages
                // TODO: Tell middleware to change the format of the messages
                this.messages = response.json().messages.substring(3).slice(0, -3).split("|");
                this.showSuccessModal(response.json().orderCode);
            }, error => {
                localStorage.removeItem('manager');
                this.dashboard.alertError(this.t.pt('views.common.error_placing'), 10000);
                this.stepper.complete();
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
            localStorage.removeItem('manager');
            this.dashboard.alertError(this.t.pt('views.common.error_placing'), 10000);
            this.stepper.complete();
        });
    }

    // In-class utils
    // ---------------------------------------------------------------
    getCashOrders(): any[] {
        return this.draftOrder.items.filter((item) => {
            return item.paymentTerm && item.paymentTerm.paymentTermCode && this.isCashCode(item.paymentTerm.paymentTermCode);
        });
    }

    getCreditOrders(): any[] {
        return this.draftOrder.items.filter((item) => {
            return item.paymentTerm && item.paymentTerm.paymentTermCode && (!this.isCashCode(item.paymentTerm.paymentTermCode));
        });
    }

    isCashCode(code: string): boolean {
        if (code == "ZCON" || code == "ZCOD") { return true; }
        else { return false; }
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
        localStorage.removeItem('manager');
    }

    closeModal() {
        this.messages = null;
        this.router.navigate(['/ordersnproduct/app/orders']);
        this.modal.close('success-placement');
    }

    payCashOrders() {
        this.modal.close('success-credit');
        this.flowMidCash(this.cashOrders);
    }
}
