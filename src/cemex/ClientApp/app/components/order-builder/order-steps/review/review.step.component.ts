import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { GoogleMapsHelper } from '../../../../utils/googlemaps.helper'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { ShipmentLocationApi } from '../../../../shared/services/api/shipment-locations.service.api';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { CustomerService } from '../../../../shared/services/customer.service';
import { DraftsService } from '../../../../shared/services/api/drafts.service';
import { Validations } from '../../../../utils/validations';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';
import { PreProduct } from '../specifications/preproduct'

import { } from '@types/googlemaps';
import * as _ from 'lodash';
import * as moment from 'moment'
declare var google: any;

@Component({
    selector: 'review-step',
    templateUrl: './review.step.html',
    styleUrls: ['./review.step.scss'],
    host: { 'class': 'w-100' }
})
export class ReviewStepComponent implements StepEventsListener {
    @Output() onCompleted = new EventEmitter<any>();
    private isMapLoaded: boolean = false;

    // Consts
    private UTIL = Validations;

    // Google map
    private map: any; // Map instance
    private geocoder: any;
    private infoWindow: any;
    private jobsiteMarker: any;

    // Subs
    draftSub: any;
    lockRequests: boolean = false;

    constructor(
        @Inject(Step) private step: Step,
        private manager: CreateOrderService,
        private shipmentApi: ShipmentLocationApi,
        private dashboard: DashboardService,
        private drafts: DraftsService,
        private customerService: CustomerService,
        private t: TranslationService) {
        this.step.setEventsListener(this);
        this.step.onBeforeBack = () => this.onBeforeBack();
    }

    // Step Interfaces
    // ------------------------------------------------------
    onBeforeBack() {
        // Cancel needed requests and lock
        this.lockRequests = true;
        if (this.draftSub) { this.draftSub.unsubscribe(); }
        this.onCompleted.emit(false);
    }

    onShowed() {
        this.lockRequests = false;
        this.onCompleted.emit(false);
        this.saveDraft();

        // Make sure div is rendered before loading the map
        //setTimeout(this.loadMap.bind(this), 0);
        this.loadMap();
    }

    loadMap() {
        if (!this.isMapLoaded) {
            GoogleMapsHelper.lazyLoadMap("summary-map", (map) => {
                this.isMapLoaded = true;
                this.map = map;
                map.setOptions({ zoom: 14, center: { lat: 25.6487281, lng: -100.4431818 } });
                this.geocoder = new google.maps.Geocoder();
                this.loadMarkersInMap();
            });
        }
        else {
            google.maps.event.trigger(this.map, "resize");
            this.geocoder = new google.maps.Geocoder();
            this.loadMarkersInMap();
        }
    }

    loadMarkersInMap() {
        this.cleanJobsiteMarker();

        if (this.manager.jobsite && this.manager.jobsite.geo) {
            this.jobsiteMarker = this.makeJobsiteMarker(this.positionFromJobsiteGeo(this.manager.jobsite.geo));
            this.addMarkerToMap(this.jobsiteMarker);
        }
        else if (this.manager.jobsite && this.manager.jobsite.address && this.manager.jobsite.address.streetName) {
            let address = this.manager.jobsite.address.streetName;
            this.geoFromAddress(address);
        }
    }

    geoFromAddress(address) {
        this.geocoder.geocode({ 'address': address }, (results, status) => {
            if (status === 'OK') {
                //return { lat: parseFloat(results[0].geometry.location.lat()), lng: parseFloat(results[0].geometry.location.lng()) }
                let position = results[0].geometry.location;
                if (position) {
                    this.jobsiteMarker = this.makeJobsiteMarker(position);
                    this.addMarkerToMap(this.jobsiteMarker);
                }
            }
        });
    }

    saveDraft() {
        // If locked (stepper is moving most likely) then dont do the call 
        if (this.lockRequests) { return; }

        //this.dashboard.alertInfo(this.t.pt('views.review.saving_draft'), 0);
        let draftSub = this.drafts.add(this.generateOrderObj()).subscribe((response) => {
            //this.dashboard.alertSuccess(this.t.pt('views.review.draft_saved'));
            this.manager.draftId = response.json().id;
            this.onCompleted.emit(response.json().id)
        }, (error) => {
            //this.dashboard.alertError(this.t.pt('views.review.draft_no_saved'));
        });
    }

    // Order gen
    private generateOrderObj() {
        let _ = this.manager;
        let baseObj = {
            "orderName": _.productLine.productLineDesc + "Online Order",
            "requestedDateTime": new Date().toISOString(),
            "purchaseOrder": _.purchaseOrder ? _.purchaseOrder : "",
            "salesArea": {
                "salesAreaId": _.salesArea[0].salesArea.salesAreaId
            },
            "customer": {
                "customerId": this.customerService.currentCustomer().legalEntityId
            },
            "shippingCondition": {
                "shippingConditionId": _.shippingCondition.shippingConditionId || Number(_.shippingCondition.shippingConditionCode)
            },
            "jobsite": {
                "jobsiteId": _.jobsite.shipmentLocationId
            },
            "instructions": _.instructions ? _.instructions : "",
            "contact": {
                "contactName": this.safeContactName(),
                "contactPhone": this.safeContactPhone()
            },
            "items": this.makeItems()
        }

        // Add point of delivery if any
        if (_.pointOfDelivery && _.pointOfDelivery.shipmentLocationId) {
            baseObj["pointOfDelivery"] = {
                "pointOfDeliveryId": _.pointOfDelivery ? _.pointOfDelivery.shipmentLocationId : ""
            }
        }

        return baseObj;
    }

    private makeItems(): any[] {
        let items = []
        this.manager.products.forEach((item, index) => {
            items.push(this.makeItem(item, index));
        });

        return items;
    }

    private makeItem(preProduct, index) {
        let _ = this.manager;
        let baseItem = {
            "itemSeqNum": 10 * (index + 1),
            "purchaseOrder": _.purchaseOrder ? _.purchaseOrder : "",
            "requestedDateTime": this.combineDateTime(preProduct),
            "currency": {
                "currencyCode": this.getCustomerCurrency()
            },
            "quantity": this.convertToTons(preProduct) || preProduct.quantity,
            "product": {
                "productId": preProduct.product.product.productId
            },
            "uom": {
                "unitId": 262 //preProduct.product.unitOfMeasure.unitId
            },
            "orderItemProfile": {
                "additionalServices": this.makeAdditionalServices(preProduct)
            }
        }

        // Add payment if needed and any
        if (preProduct.payment) {
            if (preProduct.payment.paymentTermId) {
                baseItem["paymentTerm"] = {
                    "paymentTermId": preProduct.payment.paymentTermId
                }
            }
        }

        // Add contract if any
        if (preProduct.contract && preProduct.contract.salesDocument && preProduct.contract.salesDocument.salesDocumentItemId) {
            baseItem["agreementItem"] = {
                "agreementItemId": preProduct.contract.salesDocument.salesDocumentItemId
            }
        }

        // Add plant if any
        if (preProduct.plant && preProduct.plant.plantId) {
            baseItem["shippingSource"] = {
                "shippingSourceId": preProduct.plant.plantId
            }
        }

        return baseItem;
    }

    private makeAdditionalServices(preProduct): any[] {
        let additionalServices = [];

        // Maneuvering
        if (preProduct.maneuvering) {
            additionalServices.push({ "additionalServiceCode": "MANEUVERING" });
        }

        // Others additional services
        if (preProduct.additionalServices) {
            preProduct.additionalServices.forEach((item) => {
                additionalServices.push({ "additionalServiceCode": item.entryCode });
            });
        }

        return additionalServices;
    }

    private getCustomerCurrency() {
        let country = this.customerService.currentCustomer().countryCode;
        if (country.trim() == "MX") {
            return "MXN";
        }
        else {
            return "USD";
        }
    }

    private combineDateTime(preProduct): String {
        const time = moment.utc(preProduct.time).local().format('HH:mm');
        const newDateTime = moment.utc(preProduct.date).local();

        return newDateTime.toISOString();
    }

    private safeContactName() {
        if (this.manager.contact) {
            if (this.manager.contact.name) {
                return this.manager.contact.name
            }
        }

        return ""
    }

    private safeContactPhone() {
        if (this.manager.contact) {
            if (this.manager.contact.phone) {
                return this.manager.contact.phone
            }
        }

        return ""
    }

    private safePaymentTerm(preProduct) {
        if (preProduct.payment) {
            if (preProduct.payment.paymentTermId) {
                return preProduct.payment.paymentTermId
            }
        }

        return ""
    }

    // Convert to tons quantity selected
    convertToTons(product: PreProduct) {
        let qty = product.quantity
        if (product.unit === undefined) {
            return qty
        }

        let factor = product.unit.numerator / product.unit.denominator;
        let convertion = qty * factor;
        return convertion || undefined;
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
    }

    cleanJobsiteMarker() {
        if (this.jobsiteMarker)
            this.jobsiteMarker.setMap(null);
    }
}