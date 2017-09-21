import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { GoogleMapsHelper } from '../../../../utils/googlemaps.helper'
import { Step, StepEventsListener, _Step } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from "../../../../shared/components/selectwithsearch/";
import { ShipmentLocationApi, PurchaseOrderApi } from '../../../../shared/services/api';
import { CustomerService } from '../../../../shared/services/customer.service'
import { DeliveryMode } from '../../../../models/delivery.model'
import { DashboardService } from '../../../../shared/services/dashboard.service'

@Component({
    selector: 'location-step',
    templateUrl: './location.step.html',
    styleUrls: ['./location.step.scss'],
    host: { 'class': 'w-100' }
})
export class LocationStepComponent implements OnInit, StepEventsListener {
    @Input() mapOptions?: google.maps.MapOptions;
    @Output() onCompleted = new EventEmitter<any>();
    @Output() requestNext = new EventEmitter<any>();
    MODE = DeliveryMode;

    // Selected data
    private location: any;
    private contact: any;
    private pod: any;
    private catalogOptions: Object = {};
    private selectedServices: Array<{ additionalServiceId: number }> = [];

    private purchaseOrder: string = "";
    private specialInstructions: string = "";
    shipmentLocationTypes;

    // Loading state
    private isMapLoaded: boolean = false;
    private loadings = {
        locations: false,
        contacts: true,
        pods: true,
        map: false,
        purchaseOrder: true
    }

    private validations = {
        purchaseOrder: { valid: false, mandatory: false, showError: false },
        contactPerson: { valid: false, mandatory: false, showError: false },
        jobsite: { valid: false, mandatory: true, showError: false }
    }

    private hiddens = {
        pods: true,
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
        maxHeight: '237px'
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

    private customer: any;

    constructor(@Inject(Step) private step: Step, private orderManager: CreateOrderService, private shipmentApi: ShipmentLocationApi, private customerService: CustomerService, private purchaseOrderApi: PurchaseOrderApi, private dashboard: DashboardService) {
        this.step.canAdvance = () => this.canAdvance();
        this.step.setEventsListener(this);
    }

    // Interfaces
    // ======================
    ngOnInit() {}
    
    canAdvance() {
        // Validate purchase order
        if (this.purchaseOrder.length > 0) {
            this.validations.purchaseOrder.valid = true;
        }
        else {
            this.validations.purchaseOrder.valid = false;
        }

        let advance = true;
        for (let key in this.validations) {
            if (this.validations[key].mandatory) {
                if (!this.validations[key].valid) {
                    this.validations[key].showError = true;
                    advance = false;
                }
            }
        }

        if (!advance) { return; }

        // Validate purchase order
        if (this.validations.purchaseOrder.mandatory) {
            this.dashboard.alertInfo("Validating...", 999999);
            this.purchaseOrderApi.validate(this.purchaseOrder, this.orderManager.productLine, this.location).subscribe((response) => {
                let data = response.json();
                if (data.messageType == "E") {
                    this.dashboard.alertError(data.messageText, 12000);
                    return;
                }
                else if (data.messageType == "S") {
                    this.dashboard.alertSuccess(data.messageText);
                    this.requestNext.emit();
                    return;
                }
                else {
                    this.dashboard.alertSuccess(data.messageText);
                    this.requestNext.emit();
                }
            });
            
            return false;
        }
        
        return advance;
    }

    onShowed() {
        // Reset validations
        this.resetValidations();

        this.onCompleted.emit(false);
        this.loadings.locations = true;

        this.podsIndex = undefined;
        this.loadings.pods = true;

        this.contactsIndex = undefined;
        this.loadings.contacts = true;

        // Set customer
        this.customer = this.customerService.currentCustomer();

        // PODS
        this.hiddens.pods = !this.shouldShowPOD();

        // Purchase order
        if (this.customer.countryCode.trim() == "USA") {
            this.validations.purchaseOrder.mandatory = false;
        }
        else if (this.customer.countryCode.trim() == "MX") {
            if (this.orderManager.productLine.productLineId == 6) {
                this.validations.purchaseOrder.mandatory = false;
            }
            else {
                this.validations.purchaseOrder.mandatory = true;
            }
        }

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
        else {
            google.maps.event.trigger(this.map, "resize");
        }
    }

    shouldShowPOD(): boolean {
        if (this.orderManager.productLine.productLineId == 6) { return true; }
        else if (this.orderManager.shippingCondition.shippingConditionId == this.MODE.Pickup) { return false; }
        else { return true; }
    }

    fetchJobsites(shipmentLocationTypes) {
        this.shipmentApi.all(shipmentLocationTypes, this.orderManager.productLine).subscribe((response) => {
            this.locations = response.json().shipmentLocations;
            this.locations.forEach((location, index) => {
                location.id = index;
                location.name = location.shipmentLocationDesc;
            })
            this.loadings.locations = false;
            if (this.locations.length > 0) {
                this.jobsiteChanged(this.locations[0]);
                this.locationIndex = 0;
            }
        });
    }

    // Step flow
    // =====================
    jobsiteChanged(location: any) {
        if (!location) {
            this.validations.jobsite.valid = false;
            return;
        }
        else {
            this.validations.jobsite.valid = true;
            this.validations.jobsite.showError = false;
        }

        // Set loading state
        this.loadings.pods = true;
        this.loadings.contacts = true;
        this.loadings.map = true;
        this.loadings.purchaseOrder = true;

        // Set current shipment location
        this.location = location;
        this.orderManager.selectJobsite(this.location);

        // Fetch salesarea
        this.shipmentApi.salesAreas(this.location, this.orderManager.productLine).subscribe((salesAreas) => {
            if (salesAreas.json().jobsiteSalesAreas.length > 0) {
                let salesArea = salesAreas.json().jobsiteSalesAreas;
                this.orderManager.salesArea = salesArea;

                let shouldValidatePurchaseOrder = false;
                salesArea.forEach((item) => {
                    if (item.purchaseOrderValidation) {
                        shouldValidatePurchaseOrder = true;
                        return;
                    }
                });

                this.location.purchaseOrderValidation = shouldValidatePurchaseOrder;
                this.validations.purchaseOrder.mandatory = shouldValidatePurchaseOrder;
            }
            this.loadings.purchaseOrder = false;
            this.onCompleted.emit(true);
        });

        // Fetch geolocation
        this.shipmentApi.address(this.location)
        .flatMap((address) => {
            this.location.address = address.json();
            return this.shipmentApi.geo(address.json()); 
        })
        .subscribe((geo) => {
            this.location.geo = geo.json();
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
            });

            if (this.pods.length > 0) {
                this.podsIndex = undefined;
                this.orderManager.selectPointOfDelivery(undefined);
            }

            this.loadings.pods = false;
        });

        // Fetch contacts
        this.shipmentApi.contacts(this.location).subscribe((response => {
            this.contacts = response.json().contacts;
            this.contacts.forEach((contact, index) => {
                contact.id = index;
                contact.name = contact.name;
            });
            if (this.contacts.length > 0) {
                this.contactsIndex = undefined;
                this.contactChanged(undefined);
            }
            this.loadings.contacts = false;
        }));
    }

    podChanged(pod: any) {
        this.pod = pod;
        this.orderManager.selectPointOfDelivery(pod);

        this.loadings.map = true;

        // Fetch geolocation
        this.shipmentApi.address(this.location)
        .flatMap((address) => {
            this.pod.address = address.json();
            return this.shipmentApi.geo(address.json()); 
        })
        .subscribe((geo) => {
            this.pod.geo = geo.json();
            this.cleanJobsiteMarker();
            this.jobsiteMarker = this.makeJobsiteMarker(geo.json());
            this.addMarkerToMap(this.jobsiteMarker);
            this.loadings.map = false;
        });

        // this.shipmentApi.jobsiteGeo(pod).subscribe((geo) => {
        //     this.cleanJobsiteMarker();
        //     this.jobsiteMarker = this.makeJobsiteMarker(geo.json());
        //     this.addMarkerToMap(this.jobsiteMarker);
        //     this.loadings.map = false;
        // });
    }

    purchaseOrderChanged(purchaseOrder: string) {
        this.orderManager.purchaseOrder = this.purchaseOrder;
        this.validations.purchaseOrder.showError = false;
        this.validations.purchaseOrder.valid = this.purchaseOrder.length >= 0;
    }

    contactChanged(contact: any) {
        this.contact = contact;
        this.validations.contactPerson.showError = false;
        if (contact) {
            this.validations.contactPerson.valid = true;
            this.orderManager.selectContact(this.contact);
        }
        else {
            this.validations.contactPerson.valid = false;
        }
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