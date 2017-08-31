import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { GoogleMapsHelper } from '../../../../utils/googlemaps.helper'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { ShipmentLocationApi } from '../../../../shared/api/shipment-locations.api';

@Component({
    selector: 'location-step',
    templateUrl: './location.step.html',
    styleUrls: ['./location.step.scss'],
    host: { 'class': 'w-100' }
})
export class LocationStepComponent implements OnInit, StepEventsListener {
    @Input() mapOptions?: google.maps.MapOptions;
    @Output() onCompleted = new EventEmitter<any>();

    private isMapLoaded: boolean = false;
    private map: any; // Map instance

    // Selected data
    private location: any = "";
    private contact: any = "";

    // Mapped data
    locations = [];
    contacts = [];
    
    // H4x0R
    nice: boolean;

    constructor(@Inject(Step) private step: Step, private orderManager: CreateOrderService, private shipmentApi: ShipmentLocationApi) {
        this.step.setEventsListener(this);
    }

    ngOnInit() {
        this.shipmentApi.all().subscribe((response) => {
            this.locations = response.json().shipmentLocations;
        });
    }

    onShowed() {
        if (!this.isMapLoaded) {
            GoogleMapsHelper.lazyLoadMap("jobsite-selection-map", (map) => {
                this.isMapLoaded = true;
                this.map = map;
                map.setOptions({ zoom: 14, center: { lat: 50.077626, lng: 14.424686 } });
                google.maps.event.trigger(this.map, "resize");
            });
        }
    }

    jobsiteChanged() {
        this.nice = true;
        this.orderManager.selectJobsite(this.location);

        // Fetch address
        // Right now not working so wait
        //this.shipmentApi.address(this.shipmentLocation).subscribe((response) => {});

        // Fetch pods
        // Right now not working so wait
        // this.shipmentApi.pods(this.location).subscribe((response) => {
        //     console.log(response.json())
        // });

        // Fetch contacts
        this.shipmentApi.contacts(this.location).subscribe((response => {
            this.contacts = response.json().contacts;
        }));

        this.onCompleted.emit();
    }



    pointOfDeliverySelected(event: any) {
        this.orderManager.selectPointOfDelivery({ pointOfDeliveryId: 1 });
        this.nice = true;
        this.onCompleted.emit(event);
    }

    contactChanged() {
        this.orderManager.selectContact(this.contact);
    }

}
