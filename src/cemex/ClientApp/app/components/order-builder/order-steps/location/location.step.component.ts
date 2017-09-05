import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { GoogleMapsHelper } from '../../../../utils/googlemaps.helper'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from "../../../../shared/components/selectwithsearch/";
import { ShipmentLocationApi } from '../../../../shared/services/api/shipment-locations.service.api';

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
    catalogOptions: Object = {};
    selectedServices: Array<{
        additionalServiceId: number
    }> = [];

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
        let locations;

        this.shipmentApi.all().subscribe((response) => {
            locations = response.json().shipmentLocations;
            locations.map((item, index) =>{
                this.jobsiteOptions.push({id: index, name: item.shipmentLocationDesc})
                return item;
            })
        });
        this.getCatalog();
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
        // this.shipmentApi.address(this.location).subscribe((response) => {
        //     let address = response.json();
        // });

        this.shipmentApi.jobsiteGeo(this.location).subscribe((response) => {
            console.log("geo", response.json());
        });

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

    getCatalog() {
        this.orderManager.getCatalogOptions().then(data => {
            data.catalogs.map((item) => {
                this.catalogOptions[item.catalogCode] = item;
                return item;
            });
        })        
    }

    addAdditionalServices(event, index) {
        if (event.target.checked) {
            this.selectedServices.push({
                additionalServiceId: Number(event.target.value)
            });
        } else {
            this.selectedServices = this.selectedServices.filter((service) => {
                return Number(service.additionalServiceId) !== Number(event.target.value);
            });
        }
        this.orderManager.selectAdditionalServices(this.selectedServices);
    }

}
