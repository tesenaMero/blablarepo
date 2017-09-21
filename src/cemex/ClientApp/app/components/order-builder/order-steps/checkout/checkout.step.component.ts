import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { GoogleMapsHelper } from '../../../../utils/googlemaps.helper'
import { Step, StepEventsListener, _Step } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from "../../../../shared/components/selectwithsearch/";
import { ShipmentLocationApi, PurchaseOrderApi } from '../../../../shared/services/api';
import { CustomerService } from '../../../../shared/services/customer.service';
import { DeliveryMode } from '../../../../models/delivery.model';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { DraftsService } from '../../../../shared/services/api/drafts.service'
import { EncodeDecodeJsonObjService } from '../../../../shared/services/encodeDecodeJsonObj.service';

@Component({
    selector: 'checkout-step',
    templateUrl: './checkout.step.html',
    styleUrls: ['./checkout.step.scss'],
    host: { 'class': 'w-100' }
})
export class CheckoutStepComponent implements OnInit, StepEventsListener {
    @Output() onCompleted = new EventEmitter<any>();
    @Input() draftId: any;

    draftOrder: any;

    MODE = DeliveryMode;

    constructor(@Inject(Step) private step: Step, private manager: CreateOrderService, private dashboard: DashboardService, private drafts: DraftsService, private customerService: CustomerService, private jsonObjService: EncodeDecodeJsonObjService, @Inject(DOCUMENT) private document: any,) {
        this.step.canAdvance = () => this.canAdvance();
        this.step.setEventsListener(this);
    }

    // Interfaces
    // ======================
    ngOnInit() {}

    canAdvance(): boolean {
        this.placeOrder()
        return true;
    }

    onShowed() {
        console.log("Draft:", this.draftId);
        this.dashboard.alertInfo("Recovering prices", 9999999);
        this.drafts.optimalSourcesPatch(this.draftId).flatMap((x) => {
            return this.drafts.prices(this.draftId);
        }).subscribe((response) => {
            this.draftOrder = response.json();
            console.log("Draft order", this.draftOrder);
            this.onCompleted.emit(true);
            this.dashboard.alertInfo("Prices recovered successfully");
        }, (error) => {
            this.dashboard.alertError("Something wrong happened");
            console.error('prices Error -> ' + JSON.stringify(error));
        });
    }

    // Logic
    // ======================
    getSubtotal(order) {
        let summ = 0;
        order.items.forEach(item => {
            summ += item.grossPrice * item.quantity;
        });
        return summ;
    }

    placeOrder() {
        this.dashboard.alertInfo("Placing order" + this.draftOrder.orderId);
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

        this.onCompleted.emit(false)
        let encoded = this.jsonObjService.encodeJson(cartItems);
        this.document.location.href = 'https://invoices-payments-dev2.mybluemix.net/invoices-payments/open/' + encoded;
    }
}