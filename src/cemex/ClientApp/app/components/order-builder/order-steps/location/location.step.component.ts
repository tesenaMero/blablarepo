import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GoogleMapsHelper } from '../../../../utils/googlemaps.helper'

@Component({
    selector: 'location-step',
    templateUrl: './location.step.html',
    styleUrls: ['./location.step.scss'],
    host: { 'class': 'w-100' }
})
export class LocationStepComponent implements OnInit {
    @Input() mapOptions?: google.maps.MapOptions;
    @Output() onCompleted = new EventEmitter<any>();
    map: any; // Map instance

    jobsite = "";
    nice = false;

    constructor() { }

    jobsiteSelected(event: any){
        this.nice = true;
        this.onCompleted.emit(event);
    }

    ngOnInit() {
        GoogleMapsHelper.lazyLoadMap("jobsite-selection-map", (map) => {
            this.map = map;
            map.setOptions({ zoom: 14, center: { lat: 50.077626, lng: 14.424686 } });
        });
    }

}
