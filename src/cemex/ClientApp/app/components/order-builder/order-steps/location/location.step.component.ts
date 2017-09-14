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

    // Selected data
    private location: any;
    private contact: any;
    private pod: any;
    private catalogOptions: Object = {};
    private selectedServices: Array<{ additionalServiceId: number }> = [];
    private errorLocation: boolean;

    // Loading state
    private isMapLoaded: boolean = false;
    private loadings = {
        locations: false,
        contacts: true,
        pods: true,
        map: false
    }

    // Mapped data
    locations = [];
    contacts = [];
    pods = []

    // Mapping index values (For dropdown)
    locationIndex: any;
    contactsIndex: any;
    podsIndex: any;

    // Settings configuration
    dropDownSettings: IMultiSelectSettings = {
        enableSearch: true,
        checkedStyle: 'fontawesome',
        buttonClasses: 'btn btn-default btn-block',
        dynamicTitleMaxItems: 1,
        displayAllSelectedText: false,
        closeOnClickOutside: true,
        selectionLimit: 1,
        autoUnselect: true,
        closeOnSelect: true,
    };

    // Text configuration
    jobsiteTexts: IMultiSelectTexts = {
        searchPlaceholder: 'Find jobsite',
        searchEmptyResult: 'No jobsite found...',
        defaultTitle: 'Select existing jobsite',
    };

    contactsTexts: IMultiSelectTexts = {
        searchPlaceholder: 'Find contact',
        searchEmptyResult: 'No contacts found...',
        defaultTitle: 'Select contact',
    };

    podsTexts: IMultiSelectTexts = {
        searchPlaceholder: 'Find point of delivery',
        searchEmptyResult: 'No points of deliveries found...',
        defaultTitle: 'Select existing POD',
    };

    // H4x0R
    private validationModel = {
        purchaseOrder: true,
    }

    // Google map
    private map: any; // Map instance
    private infoWindow: any;
    private jobsiteMarker: any;

    constructor(@Inject(Step) private step: Step, private orderManager: CreateOrderService, private shipmentApi: ShipmentLocationApi) {
        this.step.setEventsListener(this);
    }

    // Interfaces
    // ======================
    ngOnInit() {
        this.fetchJobsites();
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

    fetchJobsites() {
        this.shipmentApi.all().subscribe((response) => {
            this.locations = response.json().shipmentLocations;
            this.locations.forEach((location, index) => {
                location.id = index;
                location.name = location.shipmentLocationDesc;
            })
        });
    }

    getCatalog() {
        this.orderManager.getCatalogOptions().then(data => {
            data.catalogs.map((item) => {
                this.catalogOptions[item.catalogCode] = item;
                return item;
            });
        })
    }

    // Step flow
    // =====================
    jobsiteChanged(location: any) {
        // Set loading state
        this.loadings.pods = true;
        this.loadings.contacts = true;
        this.loadings.map = true;
        
        // Set current shipment location
        this.location = location;
        this.orderManager.selectJobsite(this.location);

        if(!location){
            this.errorLocation = true;
        } else {
            this.errorLocation = false;
        }

        // Fetch geolocation
        this.shipmentApi.jobsiteGeo(this.location).subscribe((geo) => {
            this.cleanJobsiteMarker();
            this.jobsiteMarker = this.makeJobsiteMarker(geo.json());
            this.addMarkerToMap(this.jobsiteMarker);
            this.loadings.map = false;
        });

        // Fetch pods
        this.shipmentApi.pods(this.location).subscribe((response) => {
            this.pods = response.json().shipmentLocations;
            this.pods.forEach((pod, index) => {
                pod.id = index;
                pod.name = pod.shipmentLocationDesc;
            })
            this.loadings.pods = false;
        });

        // Fetch contacts
        this.shipmentApi.contacts(this.location).subscribe((response => {
            this.contacts = response.json().contacts;
            this.contacts.forEach((contact, index) => {
                contact.id = index;
                contact.name = contact.name;
            })
            this.loadings.contacts = false;
        }));

        this.onCompleted.emit(event);
    }

    podChanged(pod: any) {
        // Select it
        this.orderManager.selectPointOfDelivery(this.pod);

        this.loadings.map = true;
        this.shipmentApi.jobsiteGeo(pod).subscribe((geo) => {
            this.cleanJobsiteMarker();
            this.jobsiteMarker = this.makeJobsiteMarker(geo.json());
            this.addMarkerToMap(this.jobsiteMarker);
            this.loadings.map = false;
        });
    }

    contactChanged(contact: any) {
        this.orderManager.selectContact(this.contact);
    }

    validateFormElements(e, key?: string) {
        this.validationModel[key] = Boolean(e.target.value.length);
        return e.target.value.length;
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

    // Map stuff
    // ====================
    makeJobsiteMarker(geo: any): google.maps.Marker {
        let marker = new google.maps.Marker({
            position: { lat: parseFloat(geo.latitude), lng: parseFloat(geo.longitude) },
            title: 'jobsite'
            //icon: InfoBuilder.plantIcon(plant)
        });

        // marker.addListener('click', () => {
        //     this.showPlantInfo(plant, marker);
        // });

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

    // showJobsiteInfo(plant: any, marker: any) {
    //     this.infoWindow.setContent(InfoBuilder.buildPlantInfoHTML(plant));
    //     this.infoWindow.open(this.map, marker);
    //     this.onMarkerSelected.emit(new MarkerItem(plant, MarkerType.PLANT));
    //     this._zone.run(() => {
    //         this.selectedPlant = plant;
    //     });
    // }

}