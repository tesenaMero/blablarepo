import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { GoogleMapsHelper } from '../../../../utils/googlemaps.helper'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'

import { } from '@types/googlemaps';

@Component({
    selector: 'summary-step',
    templateUrl: './summary.step.html',
    styleUrls: ['./summary.step.scss'],
    host: { 'class': 'w-100' }
})
export class SummaryStepComponent implements StepEventsListener {
    @Output() onCompleted = new EventEmitter<any>();
    map: any; // Map instance

    constructor(@Inject(Step) private step: Step) {
        this.step.setEventsListener(this);
    }

    onShowed() {
        this.onCompleted.emit({});
        GoogleMapsHelper.lazyLoadMap("summary-map", (map) => {
            this.map = map;
            map.setOptions({ zoom: 14, center: { lat: 25.6487281, lng: -100.4431818 } });
        });
    }
}