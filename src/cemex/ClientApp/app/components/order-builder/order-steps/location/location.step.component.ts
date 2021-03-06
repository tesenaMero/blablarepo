import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { GoogleMapsHelper } from '../../../../utils/googlemaps.helper'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from "../../../../shared/components/selectwithsearch/";
import { ShipmentLocationApi, PurchaseOrderApi, ShippingConditionApi } from '../../../../shared/services/api';
import { CustomerService } from '../../../../shared/services/customer.service';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { Validations } from '../../../../utils/validations';
import { Observable } from 'rxjs/Observable';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';

declare var google: any;

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
    validateSub: any;
    shippingConditionMapSub: any;

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
        containerClasses: 'location-dropdown'
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
    private geocoder: any;
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
        // Set validations state
        // ---------------------------
        // Validate purchase order
        this.validations.purchaseOrder.valid = this.isValidPurchaseOrder();

        // Contact validation
        this.validations.contactPerson.valid = this.isValidContact();

        // Check validations
        // and show error message if needed
        // --------------------------
        let advance = this.isValidationsOk();
        if (!advance) { return; }

        // Prepare observables
        // -------------------------
        // If PO need validation send it to API,
        this.validateSub = this.makeValidationSub();

        // Set shippingcondition sub
        this.shippingConditionMapSub = this.makeShippingConditionSub();

        this.dashboard.alertTranslateInfo('views.common.validating', 0);

        // Run both at the same time
        // Wait for both to finish
        Observable.forkJoin(this.shippingConditionMapSub, this.validateSub).subscribe((response) => {
            if (this.allGoodCanGo(response)) {
                this.requestNext.emit();
            }
        });

        // Do not let him advance. Wait for forkjoin above to decide
        return false;
    }

    // Before next validations
    // Validate purchase order
    isValidPurchaseOrder(): boolean {
        return this.purchaseOrder.length > 0;
    }

    isValidContact(): boolean {
        return this.manager.contact != undefined && this.manager.contact != null;
    }

    isValidationsOk(): boolean {
        for (let key in this.validations) {
            if (this.validations[key].mandatory) {
                if (!this.validations[key].valid) {
                    this.validations[key].showError = true;
                    return false;
                }
            }
        }

        return true;
    }

    makeValidationSub(): any {
        let sub = Observable.empty().defaultIfEmpty();
        if (this.validations.purchaseOrder.mandatory) {
            sub = this.purchaseOrderApi.validate(this.purchaseOrder,
                this.manager.productLine,
                this.location).map((response) => {
                    return response.json()
                });
        }

        return sub
    }

    makeShippingConditionSub(): any {
        const mode = this.manager.shippingCondition.shippingConditionCode;
        const customer = this.customerService.currentCustomer().legalEntityId;
        return this.shippingConditionApi.byCode(customer, mode).map((response) => {
            let shipppingConditions = response.json().shippingConditions
            if (shipppingConditions.length) {
                this.manager.selectDeliveryType(shipppingConditions[0]);
            }
        });
    }

    allGoodCanGo(response): boolean {
        if (this.validations.purchaseOrder.mandatory) {
            const data: any = response[1];
            if (data.messageType == "S") {
                this.dashboard.alertSuccess(data.messageText, 6000);
                return true;
            }
            else {
                this.dashboard.alertError(data.messageText, 12000);
                return false;
            }
        }
        else {
            this.dashboard.closeAlert();
            return true
        }
    }

    onShowed() {
        this.onCompleted.emit(false);
        this.isCement = Validations.isCement();

        // Unlock
        this.lockRequests = false;

        // Reset validations
        this.defineValidations();

        // TODO change this
        this.contactsIndex = undefined;
        this.podsIndex = undefined;

        this.allLoadings(true);

        // PODS
        this.initPODs()

        // Make sure div is rendered before loading the map
        //setTimeout(this.loadMap.bind(this), 0)
        this.loadMap();

        // Guard to fetch jobsites when I got shipment locations
        this.shipmentApi.shipmentLocationTypes.subscribe(data => {
            if (data) { this.fetchJobsites(); }
        });
    }

    // Init stuff
    private allLoadings(value: boolean) {
        this.loadings.locations = value;
        this.loadings.pods = value;
        this.loadings.contacts = value;
    }

    private initPODs() {
        if (!this.shouldShowPOD()) {
            this.hiddens.pods = true;
            this.manager.pointOfDelivery = undefined; // Remove pod from manager
        }
        else {
            this.hiddens.pods = false;
        }
    }

    loadMap() {
        if (!this.isMapLoaded) {
            GoogleMapsHelper.lazyLoadMap("jobsite-selection-map", (map) => {
                this.isMapLoaded = true;
                this.map = map;
                map.setOptions({ zoom: 2, center: { lat: 50.077626, lng: 14.424686 } });
                google.maps.event.trigger(this.map, "resize");
                this.geocoder = new google.maps.Geocoder();
            });
        }
        else {
            google.maps.event.trigger(this.map, "resize");
            this.geocoder = new google.maps.Geocoder();
        }
    }

    shouldShowPOD(): boolean {
        if (Validations.isUSACustomer()) { return false; }
        else if (Validations.isPickup()) { return false; }
        else { return true; }
    }

    cancelContact() {
        this.manager.contact = undefined;
    }

    fetchJobsites() {
        this.shipmentApi.all(this.manager.productLine, Validations.isReadyMix()).subscribe((response) => {
            this.locations = response.json().shipmentLocations;

            // TODO replace this with normal component
            this.locations.forEach((location, index) => {
                location.id = index;
                location.name = location.shipmentLocationCode + ' ' + location.shipmentLocationDesc;
            });

            if (this.manager.jobsite === undefined && this.location) { // Reset Jobsite and purchase order
                this.resetJobAndPO();
            }
            if (this.manager.jobsite) {
                this.jobsiteChanged(this.manager.jobsite);
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

            const hasGeoLink = this.location.address &&
                this.location.address.geoPlace &&
                this.location.address.geoPlace.links &&
                this.location.address.geoPlace.links.self || undefined

            if (!hasGeoLink) {
                let address = this.location.address.streetName;
                this.geoFromAddress(address);
            }
            else {
                // Fetch geo
                this.shipmentApi.geo(this.location.address).subscribe((geo) => {
                    if (geo && geo.json && Number(geo.json().latitude) != 0 && Number(geo.json().longitude) != 0) {
                        this.location.geo = geo.json();
                        this.cleanJobsiteMarker();
                        this.jobsiteMarker = this.makeJobsiteMarker(this.positionFromJobsiteGeo(geo.json()));
                        this.addMarkerToMap(this.jobsiteMarker);
                        this.loadings.map = false;
                    }
                    else if (this.location.address && this.location.address.streetName) {
                        let address = this.location.address.streetName;
                        this.geoFromAddress(address);
                    }
                });
            }
        });

        // Fetch pods
        this.shipmentApi.pods(this.location, this.manager.productLine).subscribe((response) => {
            this.pods = response.json().shipmentLocations;
            this.pods.forEach((pod, index) => {
                pod.id = index;
                pod.name = pod.shipmentLocationCode + ' ' + pod.shipmentLocationDesc;
            });

            if (this.pods.length > 0) {
                if (this.pod === undefined) {
                    this.podsIndex = this.pods.length === 1 ? 0 : undefined;
                    this.pods.length === 1 ? this.podChanged(this.pods[0]) : this.podChanged(undefined);
                }
                else {
                    this.pods.forEach((pod, index) => {
                        if (this.pod.shipmentLocationId === pod.shipmentLocationId) {
                            this.podsIndex = index;
                            this.podChanged(this.pods[index]);
                        }
                    });
                }
            }

            this.loadings.pods = false;
        });

        // Fetch contacts
        this.shipmentApi.contacts(this.location).subscribe((response => {
            this.contacts = response.json().contacts;
            this.contactsIndex = undefined;
            if (this.contacts) {
                if (this.contacts.length > 0) {
                    this.contacts.forEach((contact, index) => {
                        contact.id = index;
                        if (this.contact && this.contact.contactId === contact.contactId) {
                            this.contactsIndex = index;
                        }
                    });
                    if (this.contactsIndex) {
                        this.contactChanged(this.contact);
                    } else {
                        this.contactChanged(undefined);
                    }
                }
                this.loadings.contacts = false;
            }
        }));
    }

    geoFromAddress(address) {
        this.geocoder.geocode({ 'address': address }, (results, status) => {
            if (status === "OK") {
                //return { lat: parseFloat(results[0].geometry.location.lat()), lng: parseFloat(results[0].geometry.location.lng()) }
                let position = results[0].geometry.location;
                if (position) {
                    this.cleanJobsiteMarker();
                    this.jobsiteMarker = this.makeJobsiteMarker(position);
                    this.addMarkerToMap(this.jobsiteMarker);
                    this.loadings.map = false;
                }
            }
            else {
                this.loadings.map = false;
            }
        });
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
        this.shipmentApi.address(this.pod)
            .flatMap((address) => {
                this.pod.address = address.json();
                return this.shipmentApi.geo(address.json());
            })
            .subscribe((geo) => {
                if (geo.json && Number(geo.json().latitude) != 0 && Number(geo.json().longitude) != 0) {
                    this.pod.geo = geo.json();
                    this.cleanJobsiteMarker();
                    this.jobsiteMarker = this.makeJobsiteMarker(this.positionFromJobsiteGeo(geo.json()));
                    this.addMarkerToMap(this.jobsiteMarker);
                    this.loadings.map = false;
                }
                else if (this.pod.address && this.pod.address.streetName) {
                    let address = this.pod.address.streetName;
                    this.geoFromAddress(address);
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
        // if the user got the location step by pressign the back button
        if (event === undefined) {

            if (this.contact) {
                this.validations.contactPerson.showError = false;
                return
            } else {
                this.manager.contact = undefined;
                return
            }
        }

        if (event.constructor === Object && event.phone.length > 0 && event.name.length > 0) {
            this.contact = event;
            this.manager.selectContact(this.contact);
            this.validations.contactPerson.showError = false;
        }
        else if (event.length > 0 && event.constructor === Array) {
            this.contact = this.contacts[event[0]];
            this.manager.selectContact(this.contact);
            this.validations.contactPerson.showError = false;
        } else {
            this.manager.contact = undefined;
            this.validations.contactPerson.showError = true;
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
        this.resetValidations();

        // Contacts mandatory for delivery only
        if (Validations.isDelivery() && Validations.isReadyMix()) { this.validations.contactPerson.mandatory = true; }

        // MX POD mandatory
        if (Validations.isMexicoCustomer() && Validations.isDelivery()) { this.validations.pod.mandatory = true; }

        // Purchase order
        if (Validations.isUSACustomer()) {
            this.validations.purchaseOrder.mandatory = false;
        }
        else if (Validations.isMexicoCustomer()) {
            if (Validations.isReadyMix()) {
                this.validations.purchaseOrder.mandatory = false;
            }
            else {
                this.validations.purchaseOrder.mandatory = true;
            }
        }
    }

    // Map stuff
    // ====================
    positionFromJobsiteGeo(geo) {
        return { lat: parseFloat(geo.latitude), lng: parseFloat(geo.longitude) }
    }

    makeJobsiteMarker(geo: any): google.maps.Marker {
        let marker = new google.maps.Marker({
            position: geo,
            title: 'jobsite'
        });
        return marker;
    }

    addMarkerToMap(marker: google.maps.Marker) {
        marker.setMap(this.map);
        this.map.setCenter(marker.getPosition());
        this.map.setZoom(14);
    }

    cleanJobsiteMarker() {
        if (this.jobsiteMarker)
            this.jobsiteMarker.setMap(null);
    }

    resetJobAndPO() {
        this.location = undefined;
        this.locationIndex = undefined;
        this.purchaseOrder = "";
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