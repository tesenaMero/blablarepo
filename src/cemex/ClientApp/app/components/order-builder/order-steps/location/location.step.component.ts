import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { GoogleMapsHelper } from '../../../../utils/googlemaps.helper'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { JobsiteApiService } from '../../../../shared/services/jobsites-api.service';

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

    map: any; // Map instance
    jobsite: any;
    nice: boolean = false;
    model = this.createOrder

    constructor(@Inject(Step) private step: Step, public createOrder: CreateOrderService, private jobsiteApi: JobsiteApiService) {
        this.step.setEventsListener(this);
    }

    ngOnInit() {
        // this.jobsiteApi.all().subscribe(response => {

        // })
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

    jobsiteSelected(event: any) {
        this.createOrder.selectJobsite({ jobsiteId: 1 });
        this.nice = true;
        this.onCompleted.emit(event);
    }

    pointOfDeliverySelected(event: any) {
        this.createOrder.selectPointOfDelivery({ pointOfDeliveryId: 1 });
        this.nice = true;
        this.onCompleted.emit(event);
    }

    contactSelected(event: any) {
        this.createOrder.selectContact({ contactName: 'demo', contactPhone: '777888999' });
    }

}
