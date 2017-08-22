import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DeliveryMode } from '../../../../models/delivery.model'

import { CreateOrderService } from '../../../../shared/services/create-order.service';

@Component({
    selector: 'mode-step',
    templateUrl: './mode.step.html',
    styleUrls: ['./mode.step.scss'],
    host: { 'class': 'w-100' }
})
export class ModeStepComponent {
    @Output() onCompleted = new EventEmitter<any>();
    MODE = DeliveryMode;
    constructor(public createOrder: CreateOrderService) { }

    selectMode(mode: DeliveryMode) {
        this.createOrder.selectDeliveryType({ shippingConditionId: mode });
        this.onCompleted.emit(mode);
    }
}