import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { DeliveryMode } from '../../../../models/delivery.model'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { CustomerService } from '../../../../shared/services/customer.service';
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { TranslationService } from '@cemex-core/angular-services-v2/dist';

@Component({
    selector: 'mode-step',
    templateUrl: './mode.step.html',
    styleUrls: ['./mode.step.scss'],
    host: { 'class': 'w-100' }
})
export class ModeStepComponent implements StepEventsListener {
    @Output() onCompleted = new EventEmitter<any>();
    MODE = DeliveryMode;
    modes = [];

    constructor(@Inject(Step) private step: Step, 
        private manager: CreateOrderService, 
        private customerService: CustomerService,
        private t: TranslationService) {
            this.step.canAdvance = () => this.canAdvance();
            this.step.setEventsListener(this);
    }

    onShowed() {
        this.defineModes();
    }

    canAdvance() {
        return true;
    }

    defineModes() {
        // let customer = this.customerService.currentCustomer();
        // console.log(this.manager.productLine);
    }

    selectMode(mode: DeliveryMode) {
        this.manager.selectDeliveryType({ shippingConditionCode: mode });
        this.onCompleted.emit(mode);
    }
}