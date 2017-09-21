import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { GoogleMapsHelper } from '../../../../utils/googlemaps.helper'
import { Step, StepEventsListener, _Step } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from "../../../../shared/components/selectwithsearch/";
import { ShipmentLocationApi, PurchaseOrderApi } from '../../../../shared/services/api';
import { CustomerService } from '../../../../shared/services/customer.service'
import { DeliveryMode } from '../../../../models/delivery.model'
import { DashboardService } from '../../../../shared/services/dashboard.service'

@Component({
    selector: 'checkout-step',
    templateUrl: './checkout.step.html',
    styleUrls: ['./checkout.step.scss'],
    host: { 'class': 'w-100' }
})
export class CheckoutStepComponent implements OnInit, StepEventsListener {
    @Output() onCompleted = new EventEmitter<any>();
    MODE = DeliveryMode;

    constructor(@Inject(Step) private step: Step, private orderManager: CreateOrderService, private dashboard: DashboardService) {
        this.step.canAdvance = () => this.canAdvance();
        this.step.setEventsListener(this);
    }

    // Interfaces
    // ======================
    ngOnInit() {}
    
    canAdvance(): boolean {
        return true;
    }

    onShowed() {
        this.onCompleted.emit();
    }


    // Logic
    // ======================
}