import { Component, ViewChild } from '@angular/core';
import { StepperComponent } from '../../shared/stepper/'
import { DeliveryMode } from '../../models/delivery.model'

@Component({
    selector: 'order-builder',
    templateUrl: './order-builder.html',
    styleUrls: ['./order-builder.scss']
})
export class OrderBuilderComponent {
    @ViewChild(StepperComponent) stepper;
    constructor() { }

    modeStepCompleted(mode: DeliveryMode) {
        this.stepper.next();
    }

}
