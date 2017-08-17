import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DeliveryMode } from '../../../../models/delivery.model'

@Component({
    selector: 'mode-step',
    templateUrl: './mode.step.html',
    styleUrls: ['./mode.step.scss'],
    host: { 'class': 'w-100' }
})
export class ModeStepComponent {
    @Output() onCompleted = new EventEmitter<any>();
    MODE = DeliveryMode;
    constructor() { }

    selectMode(mode: DeliveryMode) {
        this.onCompleted.emit(mode);
    }
}