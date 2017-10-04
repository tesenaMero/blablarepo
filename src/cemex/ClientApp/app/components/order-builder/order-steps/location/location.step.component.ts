import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { GoogleMapsHelper } from '../../../../utils/googlemaps.helper'
import { Step, StepEventsListener, _Step } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from "../../../../shared/components/selectwithsearch/";
import { ShipmentLocationApi, PurchaseOrderApi, ShippingConditionApi } from '../../../../shared/services/api';
import { CustomerService } from '../../../../shared/services/customer.service';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { Validations } from '../../../../utils/validations';
import { Observable } from 'rxjs/Observable';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';

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

    // Selected data
    private location: any;
    private contact: any;
    private pod: any;
    private catalogOptions: Object = {};

    private purchaseOrder: string = "";
    private specialInstructions: string = "";

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
        pod: { valid: false, mandatory: false, showError: false },
        jobsite: { valid: false, mandatory: true, showError: false }
    }

    private hiddens = {
        pods: true,
    }

    // Subs
    salesAdressSub: any;
    lockRequests: boolean = false;

    // Mapped data
    locations = [];
    contacts = [];
    pods = []

    // Mapping index values (For dropdown)
    locationIndex: any;
    contactsIndex: any;
    podsIndex: any;

    isCement: boolean;

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
        closeOnSelect: true,
        maxHeight: '237px'
    };

    // Text configuration
    jobsiteTexts: IMultiSelectTexts = {
        searchPlaceholder: this.t.pt('views.location.find_jobsite'),
        searchEmptyResult: this.t.pt('views.location.no_jobsite'),
        defaultTitle: this.t.pt('views.location.select_existing_jobsite'),
    };

    contactsTexts: IMultiSelectTexts = {
        searchPlaceholder: this.t.pt('views.location.find_contact'),
        searchEmptyResult: this.t.pt('views.location.no_contact'),
        defaultTitle: this.t.pt('views.location.select_contact'),
    };

    podsTexts: IMultiSelectTexts = {
        searchPlaceholder: this.t.pt('views.location.find_pod'),
        searchEmptyResult: this.t.pt('views.location.no_pod'),
        defaultTitle: this.t.pt('views.location.select_existing_pod'),
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

    private UTILS: any;

    constructor( 
        @Inject(Step) private step: Step, 
        private manager: CreateOrderService, 
        private shipmentApi: ShipmentLocationApi, 
        private customerService: CustomerService, 
        private purchaseOrderApi: PurchaseOrderApi, 
        private dashboard: DashboardService, 
        private shippingConditionApi: ShippingConditionApi,
        private t: TranslationService) {

        // Interfaces
        this.step.canAdvance = () => this.canAdvance();
        this.step.onBeforeBack = () => this.onBeforeBack();
        this.step.setEventsListener(this);
    }

    ngOnInit() { }

    // Step Interfaces
    // ------------------------------------------------------
    onBeforeBack() {
        // Cancel needed requests and lock
        this.lockRequests = true;
        this.salesAdressSub && this.salesAdressSub.unsubscribe();
    }

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
            this.dashboard.alertInfo(this.t.pt('views.common.validating'), 0);
            this.purchaseOrderApi.validate(this.purchaseOrder, this.manager.productLine, this.location).subscribe((response) => {
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

    // Replacing the object shippingCondition with the api one
    mapShippingCondition() {
        const mode = this.manager.shippingCondition.shippingConditionCode;
        const customer = this.customerService.currentCustomer().legalEntityId;
        this.shippingConditionApi.byCode(customer, mode).subscribe((response) => {
            let shipppingConditions = response.json().shippingConditions
            if (shipppingConditions.length) {
                this.manager.selectDeliveryType(shipppingConditions[0]);
            }
        });
    }

    onShowed() {
        this.onCompleted.emit(true);

        this.isCement = Validations.isCement();

        // Map shippingcondition
        this.mapShippingCondition();

        // Unlock
        this.lockRequests = false;

        // Reset validations
        this.resetValidations();
        this.defineValidations();

        this.onCompleted.emit(false);
        this.loadings.locations = true;

        this.podsIndex = undefined;
        this.loadings.pods = true;

        this.contactsIndex = undefined;
        this.loadings.contacts = true;

        // PODS
        if (!this.shouldShowPOD()) {
            this.hiddens.pods = true;
            // Remove pod from manager
            this.manager.pointOfDelivery = undefined;
        }
        else {
            this.hiddens.pods = false;
        }

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

        // Guard to fetch jobsites when I got shipment locations
        this.shipmentApi.shipmentLocationTypes.subscribe(data => {
            if (data) { this.fetchJobsites(); }
        });

        // if the user got the location step by pressign the back button
        if(this.contact && this.contact.name && this.contact.phone) {
            this.validations.contactPerson.valid = true;
        }
    }

    shouldShowPOD(): boolean {
        if (Validations.isUSACustomer()) { return false; }
        else if (Validations.isPickup()) { return false; }
        else { return true; }
    }

    fetchJobsites() {
        this.shipmentApi.all(this.manager.productLine).subscribe((response) => {
            this.locations = response.json().shipmentLocations;
            this.locations.forEach((location, index) => {
                location.id = index;
                location.name = location.shipmentLocationDesc;
            })
            if (this.location) {
                this.jobsiteChanged(this.location);
            }
            else if (this.locations.length === 1) {
                this.jobsiteChanged(this.locations[0]);
                this.locationIndex = 0;
            }
            this.loadings.locations = false;
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
        this.manager.selectJobsite(this.location);

        // If locked stop
        if (this.lockRequests) {
            this.onCompleted.emit(false);
            return;
        }

        // Make salesarea call, dont fetch yet
        let salesAreaSub = this.shipmentApi.salesAreas(this.location, this.manager.productLine)
        .map((salesAreas) => {
            if (salesAreas.json().jobsiteSalesAreas.length > 0) {
                let salesArea = salesAreas.json().jobsiteSalesAreas;
                this.manager.salesArea = salesArea;

                // If its not pickup then all we need to be fetched is sales areas.
                // If its pickup we need to wait for address object to be fetched
                if (!Validations.isPickup()) {
                    this.onCompleted.emit(true);
                }

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
        });

        //  Make address, dont fetch yet
        let addressSub = this.shipmentApi.address(this.location).map((address) => {
            this.location.address = address.json();
        })

        // Fork join address + sales areas (fetch)
        this.salesAdressSub = Observable.forkJoin(salesAreaSub, addressSub).subscribe((response) => {
            this.onCompleted.emit(true);
            
            // Fetch geo
            this.shipmentApi.geo(this.location.address).subscribe((geo) => {
                if (geo && geo.json) {
                    this.location.geo = geo.json();
                    this.cleanJobsiteMarker();
                    this.jobsiteMarker = this.makeJobsiteMarker(geo.json());
                    this.addMarkerToMap(this.jobsiteMarker);
                    this.loadings.map = false;
                }
            });
        });

        // Fetch pods
        this.shipmentApi.pods(this.location, this.manager.productLine).subscribe((response) => {
            this.pods = response.json().shipmentLocations;
            this.pods.forEach((pod, index) => {
                pod.id = index;
                pod.name = pod.shipmentLocationDesc;
            });

            if (this.pods.length > 0) {
                if (this.pod === undefined) {
                    this.podsIndex = this.pods.length === 1 ? 0 : undefined;
                    this.pods.length === 1 ? this.podChanged(this.pods[0]) : this.podChanged(undefined);
                }
                else {
                    this.pods.forEach((pod, index) => {
                        if (this.pod.shipmentLocationId === pod.shipmentLocationId){
                            this.podsIndex = index;
                            this.podChanged(this.pods[index]);
                        }
                    });
                }
            }         

            this.loadings.pods = false;
        });

        if (!this.isCement) {
            // Fetch contacts
            this.shipmentApi.contacts(this.location).subscribe((response => {
                this.contacts = response.json().contacts;
                if (this.contacts) {
                    this.contacts.forEach((contact, index) => {
                        contact.id = index;
                        contact.name = contact.name;
                    });
                    
                    if (this.contacts.length > 0) {
                        this.contactsIndex = undefined;
                        this.contactChanged(undefined);
                    }
                    this.loadings.contacts = false;
                }
            }));
        }
    }

    podChanged(pod: any) {
        if (!pod) {
            this.validations.pod.valid = false;
            return;
        }
        else {
            this.validations.pod.valid = true;
            this.validations.pod.showError = false;
        }

        this.pod = pod;
        this.manager.selectPointOfDelivery(pod);

        this.loadings.map = true;

        // Fetch geolocation
        this.shipmentApi.address(this.location)
            .flatMap((address) => {
                this.pod.address = address.json();
                return this.shipmentApi.geo(address.json());
            })
            .subscribe((geo) => {
                if (geo.json) {
                    this.pod.geo = geo.json();
                    this.cleanJobsiteMarker();
                    this.jobsiteMarker = this.makeJobsiteMarker(geo.json());
                    this.addMarkerToMap(this.jobsiteMarker);
                    this.loadings.map = false;
                }
            });

        // this.shipmentApi.jobsiteGeo(pod).subscribe((geo) => {
        //     this.cleanJobsiteMarker();
        //     this.jobsiteMarker = this.makeJobsiteMarker(geo.json());
        //     this.addMarkerToMap(this.jobsiteMarker);
        //     this.loadings.map = false;
        // });
    }

    purchaseOrderChanged(purchaseOrder: string) {
        this.manager.purchaseOrder = this.purchaseOrder;
        this.validations.purchaseOrder.showError = false;
        this.validations.purchaseOrder.valid = this.purchaseOrder.length >= 0;
    }

    contactChanged(event: any) {
        if (!event) { this.validations.contactPerson.valid = false; return; }

        // If picked form dropdown: model will be []
        if (event.constructor === Array && event.length > 0) {
            let contact = this.contacts[event[0]];
            this.contact = contact;
            this.validations.contactPerson.showError = false;
            if (contact) {
                this.validations.contactPerson.valid = true;
                this.manager.selectContact(this.contact);
            }
        }
        // If manually wrote
        else if ((!!event) && (event.constructor === Object)) {
            if (event.phone.length > 0 && event.name.length > 0) {
                this.contact = event;
                this.validations.contactPerson.showError = false;
                this.validations.contactPerson.valid = true;
                this.manager.selectContact(this.contact);
            }
            else {
                this.validations.contactPerson.valid = false;
                return;
            }
        }
        else {
            this.validations.contactPerson.valid = false;
            return;
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
            this.validations[key].mandatory = false;
        }

        // Jobsite selection mandatory by default
        this.validations.jobsite.mandatory = true;
    }

    defineValidations() {
        // Contacts mandatory for delivery only
        if (Validations.isDelivery() && !this.isCement) {
            this.validations.contactPerson.mandatory = true;
        }
        // MX POD mandatory
        if (Validations.isMexicoCustomer() && Validations.isDelivery()) {
            this.validations.pod.mandatory = true;
        }
        // Purchase order
        if (Validations.isUSACustomer()) {
            this.validations.purchaseOrder.mandatory = false;
        }
        else if (Validations.isMexicoCustomer()) {
            if (this.manager.productLine.productLineId == 6) {
                this.validations.purchaseOrder.mandatory = false;
            }
            else {
                this.validations.purchaseOrder.mandatory = true;
            }
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