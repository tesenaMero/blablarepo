import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { GoogleMapsHelper } from '../../../../utils/googlemaps.helper'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { ShipmentLocationApi } from '../../../../shared/api/shipment-locations.api';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from "../../../../shared/components/selectwithsearch/";

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

    // Default selection
    optionsModel: number[] = [ ];

    // Settings configuration
    jobsiteSettings: IMultiSelectSettings = {
        enableSearch: true,
        checkedStyle: 'fontawesome',
        buttonClasses: 'btn btn-default btn-block',
        dynamicTitleMaxItems: 1,
        displayAllSelectedText: true,
        closeOnClickOutside: true,
        selectionLimit: 1,
        autoUnselect: true,
        closeOnSelect: true,
    };

    // Text configuration
    jobsiteTexts: IMultiSelectTexts = {
        checkAll: 'Select all',
        uncheckAll: 'Unselect all',
        checked: 'item selected',
        checkedPlural: 'items selected',
        searchPlaceholder: 'Find jobsite',
        searchEmptyResult: 'No jobsite found...',
        searchNoRenderText: 'Type in search box to see results...',
        defaultTitle: 'Select existing jobsite',
    };

    // Labels / Parents
    jobsiteOptions: IMultiSelectOption[] = [];

    
    // H4x0R
    nice: boolean;
    jobsite: any;

    validationModel = {
        purchaseOrder: true,
    }

    constructor(@Inject(Step) private step: Step, private orderManager: CreateOrderService, private shipmentApi: ShipmentLocationApi) {
        this.step.setEventsListener(this);
    }

    ngOnInit() {
        this.shipmentApi.all().subscribe((response) => {
            this.locations = response.json().shipmentLocations;
            this.locations.map((item, index) =>{
                this.jobsiteOptions.push({id: index, name: item.shipmentLocationDesc})
                return item;
            })
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
        
        if(this.validateFormElements(event)) {
            this.onCompleted.emit(event);
        }
    }



    pointOfDeliverySelected(event: any) {
        this.orderManager.selectPointOfDelivery({ pointOfDeliveryId: 1 });
        this.nice = true;
        if(this.validateFormElements(event)) {
            this.onCompleted.emit(event);
        }
    }

    contactChanged() {
        this.orderManager.selectContact(this.contact);
    }

    validateFormElements(e, key?: string) {
        this.validationModel[key] = Boolean(e.target.value.length);
        return e.target.value.length;
    }

}
