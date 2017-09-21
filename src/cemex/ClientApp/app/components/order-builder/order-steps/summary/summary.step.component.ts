import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { GoogleMapsHelper } from '../../../../utils/googlemaps.helper'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { ShipmentLocationApi } from '../../../../shared/services/api/shipment-locations.service.api';
import { DeliveryMode } from '../../../../models/delivery.model';

import { } from '@types/googlemaps';

@Component({
    selector: 'summary-step',
    templateUrl: './summary.step.html',
    styleUrls: ['./summary.step.scss'],
    host: { 'class': 'w-100' }
})
export class SummaryStepComponent implements StepEventsListener {
    @Output() onCompleted = new EventEmitter<any>();
    private isMapLoaded: boolean = false;

    // Consts
    private MODE = DeliveryMode;

    // Google map
    private map: any; // Map instance
    private infoWindow: any;
    private jobsiteMarker: any;

    constructor(@Inject(Step) private step: Step, private manager: CreateOrderService, private shipmentApi: ShipmentLocationApi) {
        this.step.setEventsListener(this);
    }

    onShowed() {
        this.onCompleted.emit();

        // Load map
        if (!this.isMapLoaded) {
            GoogleMapsHelper.lazyLoadMap("summary-map", (map) => {
                this.isMapLoaded = true;
                this.map = map;
                map.setOptions({ zoom: 14, center: { lat: 25.6487281, lng: -100.4431818 } });
            });
        }
        else {
            google.maps.event.trigger(this.map, "resize");
        }

        console.log("manager", this.manager);
        this.cleanJobsiteMarker();
        this.jobsiteMarker = this.makeJobsiteMarker(this.manager.jobsite.geo);
        this.addMarkerToMap(this.jobsiteMarker);
    }

    // Map stuff
    // ====================
    makeJobsiteMarker(geo: any): google.maps.Marker {
        let marker = new google.maps.Marker({
            position: { lat: parseFloat(geo.latitude), lng: parseFloat(geo.longitude) },
            title: 'jobsite'
        });

        return marker;
    }

    addMarkerToMap(marker: google.maps.Marker) {
        marker.setMap(this.map);
        this.map.setCenter(marker.getPosition());
    }

    cleanJobsiteMarker() {
        if (this.jobsiteMarker)
            this.jobsiteMarker.setMap(null);
    }
}