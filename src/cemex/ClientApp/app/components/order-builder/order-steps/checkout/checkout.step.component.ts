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

    MODE = DeliveryMode;
    private PRODUCT_LINES = {
        Readymix: 6,
        CementBulk: 1
    }

    draftOrder: any;

    constructor( @Inject(Step) private step: Step,
        private manager: CreateOrderService,
        private dashboard: DashboardService,
        private drafts: DraftsService,
        private customerService: CustomerService) {
        this.step.setEventsListener(this);
    }

    // Interfaces
    // ======================
    ngOnInit() { }

    onShowed() {
        // Patch optimal sources then recovers prices
        if (this.shouldCallOptimalSource()) {
            this.dashboard.alertInfo("Recovering prices", 0);
            this.drafts.optimalSourcesPatch(this.draftId).flatMap((x) => {
                return this.drafts.prices(this.draftId);
            }).subscribe((response) => {
                this.handlePrices(response);
            }, (error) => {
                this.dashboard.alertError("Something wrong happened");
                console.error("Prices error", error);
            });
        }
        else if (this.shouldCallPrices()) {
            this.drafts.prices(this.draftId).subscribe((response) => {
                this.handlePrices(response);
            });
        }
    }

    shouldCallOptimalSource() {
        return this.customerService.currentCustomer().countryCode.trim() == "MX"
            && this.manager.productLine.productLineId != this.PRODUCT_LINES.Readymix
            && this.manager.shippingCondition.shippingConditionId == this.MODE.Delivery
    }

    shouldCallPrices() {
        return this.customerService.currentCustomer().countryCode.trim() == "MX"
                && this.manager.productLine.productLineId != this.PRODUCT_LINES.Readymix
    }

    handlePrices(response) {
        this.draftOrder = response.json();
        this.onCompleted.emit(this.draftOrder);
        this.dashboard.alertSuccess("Prices recovered successfully");
    }

    // Logic
    // ======================
    getSubtotal() {
        let summ = 0;
        this.draftOrder.items.forEach(item => {
            summ += item.grossPrice;
        });
        return summ;
    }

    getTaxes() {
        let taxes = 0;
        this.draftOrder.items.forEach(item => {
            taxes += item.taxAmount;
        });
        return taxes;
    }

    getGrandTotal() {
        let total = 0;
        this.draftOrder.items.forEach(item => {
            total += item.totalPrice;
        });
        return total;
    }
}