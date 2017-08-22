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
        GoogleMapsHelper.lazyLoadMap("summary-map", (map) => {
            this.map = map;
            map.setOptions({ zoom: 14, center: { lat: 50.077626, lng: 14.424686 } });
        });
    }
}