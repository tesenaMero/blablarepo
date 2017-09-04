import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { StepperComponent } from '../../shared/components/stepper/';
import { DeliveryMode } from '../../models/delivery.model';

@Component({
    selector: 'order-builder',
    templateUrl: './order-builder.html',
    styleUrls: ['./order-builder.scss']
})
export class OrderBuilderComponent {
    @ViewChild(StepperComponent) stepper;
    private READYMIX_ID = 6;
    private isReadyMix: boolean = false;

    constructor(private _changeDetector: ChangeDetectorRef) { }

    modeStepCompleted(mode: DeliveryMode) {
        this.stepper.complete();
    }

    locationStepCompleted(event: any) {
        this.stepper.complete();
    }

    productStepCompleted(product: any) {
        this.isReadyMix = product.productLineId == this.READYMIX_ID;
        this._changeDetector.detectChanges();
        this.stepper.complete();
    }

    summaryStepCompleted() {
        this.stepper.complete();
    }

    specificationsStepShowed() {
        // Remove this one when the step is ready
        this.stepper.complete();
    }
}
