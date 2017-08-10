import { Component, OnInit, Input } from '@angular/core';
import { GoogleMapsHelper } from '../../utils/googlemaps.helper'
//import { } from '@types/googlemaps';
//declare var google: any;

@Component({
    selector: 'new-order',
    templateUrl: './new-order.html',
    styleUrls: ['./new-order.scss']
})
export class NewOrderComponent implements OnInit {
    @Input() mapOptions?: google.maps.MapOptions;

    map: any; // Map instance

    constructor() { }

    ngOnInit() {
        GoogleMapsHelper.lazyLoadMap("jobsite-selection-map", (map) => {
            this.map = map;
            map.setOptions({ zoom: 14, center: { lat: 50.077626, lng: 14.424686 } });
        });
    }
}
