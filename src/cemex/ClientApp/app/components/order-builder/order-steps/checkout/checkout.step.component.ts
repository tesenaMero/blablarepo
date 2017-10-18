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
import { TranslationService } from '@cemex-core/angular-services-v2/dist';
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
    draftOrder: any;

    // Readymix
    prices = {
        subtotal: 0,
        taxes: 0,
        total: 0
    }

    // Sub
    optimalSourceSub: any;
    pricesSub: any;
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
        if (this.optimalSourceSub) { this.optimalSourceSub.unsubscribe(); }
        if (this.pricesSub) { this.pricesSub.unsubscribe(); }
        this.onCompleted.emit(false);
    }

    onShowed() {
        this.lockRequests = false;
        if (this.isReadyMix()) {
            this.calculatePrices();
        }

        // Patch optimal sources then recovers prices
        this.onCompleted.emit(false);
        if (this.shouldCallOptimalSource()) {
            this.dashboard.alertTranslateInfo('views.checkout.recovering_prices', 0);
            this.optimalSourceSub = this.drafts.optimalSourcesPatch(this.manager.draftId).flatMap((x) => {
                this.manager.isPatched = true;
                return this.drafts.prices(this.manager.draftId);
            }).subscribe((response) => {
                this.handlePrices(response);
            }, (error) => {
                this.dashboard.alertTranslateError('views.common.something_was_wrong');
            });
        }
        else if (this.shouldCallPrices()) {
            this.pricesSub = this.drafts.prices(this.manager.draftId).subscribe((response) => {
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
        this.prices.subtotal = 0;
        this.prices.taxes = 0;
        this.prices.total = 0;

        this.manager.products.forEach(item => {
            this.prices.subtotal += (item.contract.unitaryPrice.net * item.quantity);
            this.prices.taxes += (item.contract.unitaryPrice.tax * item.quantity);
            this.prices.total += (item.contract.unitaryPrice.net * item.quantity) + (item.contract.unitaryPrice.tax * item.quantity);
        });
    }

    handlePrices(response) {
        this.draftOrder = this.manager.draftOrder || response.json();
        // If locked (stepper is moving most likely) then dont do the call 
        if (this.lockRequests) { return; }

        if (this.getGrandTotal() != 0) {
            this.onCompleted.emit(this.draftOrder);
            this.dashboard.alertTranslateSuccess('views.checkout.prices_recovered');
        }
        else {
            let messages = this.draftOrder.messages.split('|', 2);
            this.dashboard.alertSuccess(messages[1].trim());
        }           
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
        return !Validations.isUSACustomer();
    }
}