import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { GoogleMapsHelper } from '../../../../utils/googlemaps.helper'
import { Step, StepEventsListener, _Step } from '../../../../shared/components/stepper/'
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
    shipmentLocationTypes;

    // Loading state
    private isMapLoaded: boolean = false;
    private loadings = {
        locations: false,
        contacts: true,
        pods: true,
        map: false
    }

    private validations = {
        purchaseOrder: { valid: false, mandatory: false },
        contactPerson: { valid: false, mandatory: false }
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

    contactsSettings: IMultiSelectSettings = {
        enableSearch: true,
        checkedStyle: 'fontawesome',
        buttonClasses: 'btn btn-default btn-block',
        dynamicTitleMaxItems: 1,
        displayAllSelectedText: false,
        closeOnClickOutside: true,
        selectionLimit: 1,
        autoUnselect: true,
        addOption: true,
        maxHeight: '250px'
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
        this.getCatalog();
    }

    onShowed() {
        this.orderManager._shipmentLocationType.subscribe(data => {
            this.shipmentLocationTypes = data.shipmentLocationTypes;
            this.fetchJobsites(this.shipmentLocationTypes);
        });
        if (!this.isMapLoaded) {
            GoogleMapsHelper.lazyLoadMap("jobsite-selection-map", (map) => {
                this.isMapLoaded = true;
                this.map = map;
                map.setOptions({ zoom: 14, center: { lat: 50.077626, lng: 14.424686 } });
                google.maps.event.trigger(this.map, "resize");
            });
        }
    }

    fetchJobsites(shipmentLocationTypes) {
        this.shipmentApi.all(shipmentLocationTypes, this.orderManager.productLine).subscribe((response) => {
            this.locations = response.json().shipmentLocations;
            this.locations.forEach((location, index) => {
                location.id = index;
                location.name = location.shipmentLocationDesc;
            })
        });

        // this.shipmentApi.jobsites(this.orderManager.productLine).subscribe((response) => {
        //     //this.locations = response.json().shipmentLocations;
        //     console.log("shipment locations", response.json().shipmentLocations);
        // });
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
        this.onCompleted.emit(true);
        
        // Set loading state
        this.loadings.pods = true;
        this.loadings.contacts = true;
        this.loadings.map = true;

        // Set current shipment location
        this.location = location;
        this.orderManager.selectJobsite(this.location);
        this.onCompleted.emit(true);

        if (!location) {
            this.errorLocation = true;
        }
        else {
            this.errorLocation = false;
        }

        // Fetch salesarea
        this.shipmentApi.salesAreas(this.location, this.orderManager.productLine).subscribe((salesAreas) => {
            if (salesAreas.json().jobsiteSalesAreas.length > 0) {
                let salesArea = salesAreas.json().jobsiteSalesAreas[0];
                this.orderManager.salesArea = salesArea;
                this.location.purchaseOrderValidation = salesArea.purchaseOrderValidation;
                this.validations.purchaseOrder.mandatory = salesArea.purchaseOrderValidation;
                //this.validateForm();
            }
        });

        // Fetch geolocation
        this.shipmentApi.jobsiteGeo(this.location).subscribe((geo) => {
            this.cleanJobsiteMarker();
            this.jobsiteMarker = this.makeJobsiteMarker(geo.json());
            this.addMarkerToMap(this.jobsiteMarker);
            this.loadings.map = false;
        });

        // Fetch pods
        this.shipmentApi.pods(this.location, this.shipmentLocationTypes, null, this.orderManager.productLine).subscribe((response) => {
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
    }

    podChanged(pod: any) {
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

    validateForm() {
        let valid = false;
        // Validate a jobsite is selected
        this.onCompleted.emit(false);
        if (this.location) {
            if (this.hasMandatories) {
                for (let key in this.validations) {
                    if (this.validations[key].mandatory) {
                        if (this.validate(key)) {
                            valid = false;
                        }
                    }
                }
            }
            else {
                valid = true;
            }
        }

        if (valid) { this.onCompleted.emit(true); }
        else { this.onCompleted.emit(true) }
    }

    validate(key: any): boolean {
        return false;
    }

    hasMandatories(): boolean {
        for (let key in this.validations) {
            if (this.validations[key].mandatory) {
                return true;
            }
        }

        return false;
    }

    resetValidations() {
        for (let key in this.validations) {
            this.validations[key].valid = false;
        }
    }

    // Map stuff
    // ====================
    makeJobsiteMarker(geo: any): google.maps.Marker {
        let marker = new google.maps.Marker({
            position: { lat: parseFloat(geo.latitude), lng: parseFloat(geo.longitude) },
            title: 'jobsite',
            icon: '/images/map/jobsite.png'
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