import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { GoogleMapsHelper } from '../../../../utils/googlemaps.helper'
import { Step, StepEventsListener, _Step } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from "../../../../shared/components/selectwithsearch/";
import { ShipmentLocationApi, PurchaseOrderApi } from '../../../../shared/services/api';
import { CustomerService } from '../../../../shared/services/customer.service';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { DraftsService } from '../../../../shared/services/api/drafts.service'
import { EncodeDecodeJsonObjService } from '../../../../shared/services/encodeDecodeJsonObj.service';
import { TranslationService } from '../../../../shared/services/translation.service'
import { Validations } from '../../../../utils/validations';

@Component({
    selector: 'checkout-step',
    templateUrl: './checkout.step.html',
    styleUrls: ['./checkout.step.scss'],
    host: { 'class': 'w-100' }
})
export class CheckoutStepComponent implements OnInit, StepEventsListener {
    @Output() onCompleted = new EventEmitter<any>();
    @Input() draftId: any;

    UTIL = Validations;

    private PRODUCT_LINES = {
        Readymix: 6,
        CementBulk: 1
    }

    draftOrder: any;

    // Readymix
    prices = {
        subtotal: 0,
        taxes: 0,
        total: 0
    }

    // Sub
    lockRequests: boolean = false;

    constructor( @Inject(Step) private step: Step,
        private manager: CreateOrderService,
        private dashboard: DashboardService,
        private drafts: DraftsService,
        private customerService: CustomerService,
        private t: TranslationService) {

        this.step.onBeforeBack = () => this.onBeforeBack();
        this.step.setEventsListener(this);
    }

    ngOnInit() { }

    // Step Interfaces
    // ------------------------------------------------------
    onBeforeBack() {
        // Cancel needed requests and lock
        this.lockRequests = true;
    }

    onShowed() {
        this.lockRequests = false;
        if (this.isReadyMix()) {
            this.calculatePrices();
        }

        // Patch optimal sources then recovers prices
        this.onCompleted.emit(false);
        if (this.shouldCallOptimalSource()) {
            this.dashboard.alertInfo(this.t.pt('views.checkout.recovering_prices'), 0);
            this.drafts.optimalSourcesPatch(this.draftId).flatMap((x) => {
                return this.drafts.prices(this.draftId);
            }).subscribe((response) => {
                this.handlePrices(response);
            }, (error) => {
                this.dashboard.alertError(this.t.pt('views.common.something_was_wrong'));
                console.error(this.t.pt('views.checkout.prices_error'), error);
            });
        }
        else if (this.shouldCallPrices()) {
            this.drafts.prices(this.draftId).subscribe((response) => {
                this.handlePrices(response);
            });
        }
        else {
            this.onCompleted.emit(false);
        }
    }

    shouldCallOptimalSource() {
        return Validations.isMexicoCustomer() && Validations.isCement() && Validations.isDelivery();
    }

    shouldCallPrices() {
        return Validations.isMexicoCustomer() && Validations.isCement();
    }

    // Readymix only
    calculatePrices() {
        this.manager.products.forEach(item => {
            this.prices.subtotal += (item.contract.unitaryPrice.net * item.quantity);
            this.prices.taxes += (item.contract.unitaryPrice.tax * item.quantity);
            this.prices.total += (item.contract.unitaryPrice.gross * item.quantity);
        });
    }

    handlePrices(response) {
        this.draftOrder = response.json();
        
        // If locked (stepper is moving most likely) then dont do the call 
        if (this.lockRequests) { return; }

        this.onCompleted.emit(this.draftOrder);
        this.dashboard.alertSuccess(this.t.pt('views.checkout.prices_recovered'));
    }

    isMXCustomer() {
        return this.customerService.currentCustomer().countryCode.trim() == "MX";
    }

    isUSACustomer() {
        return this.customerService.currentCustomer().countryCode.trim() == "US";
    }

    isReadyMix() {
        return Validations.isReadyMix();
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

    shouldShowPrices(): boolean {
        return !this.isUSACustomer();
    }
}