import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { GoogleMapsHelper } from '../../../../utils/googlemaps.helper'
import { Step, StepEventsListener } from '../../../../shared/components/stepper/'
import { CreateOrderService } from '../../../../shared/services/create-order.service';
import { ShipmentLocationApi } from '../../../../shared/services/api/shipment-locations.service.api';
import { DeliveryMode } from '../../../../models/delivery.model';
import { DashboardService } from '../../../../shared/services/dashboard.service'
import { CustomerService } from '../../../../shared/services/customer.service'
import { DraftsService } from '../../../../shared/services/api/drafts.service'

import { } from '@types/googlemaps';

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
    private MODE = DeliveryMode;

    // Google map
    private map: any; // Map instance
    private infoWindow: any;
    private jobsiteMarker: any;

    constructor( @Inject(Step) private step: Step, private manager: CreateOrderService, private shipmentApi: ShipmentLocationApi, private dashboard: DashboardService, private drafts: DraftsService, private customerService: CustomerService) {
        this.step.setEventsListener(this);
    }

    onShowed() {
        this.onCompleted.emit(false);
        this.saveDraft();

        // Load map
        if (!this.isMapLoaded) {
            GoogleMapsHelper.lazyLoadMap("summary-map", (map) => {
                this.isMapLoaded = true;
                this.map = map;
                map.setOptions({ zoom: 14, center: { lat: 25.6487281, lng: -100.4431818 } });
            });
        }
        else {
            google.maps.event.trigger(this.map, "resize");
        }

        console.log("manager", this.manager);
        this.cleanJobsiteMarker();
        this.jobsiteMarker = this.makeJobsiteMarker(this.manager.jobsite.geo);
        this.addMarkerToMap(this.jobsiteMarker);
    }

    saveDraft() {
        this.dashboard.alertInfo("Saving draft...");
        this.drafts.add(this.generateOrderObj()).subscribe((response) => {
            this.dashboard.alertSuccess("Draft saved!");
            this.onCompleted.emit(response.json().id)
        }, (error) => {
            this.dashboard.alertError("Couldn't save the draft");
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
                "shippingConditionId": _.shippingCondition.shippingConditionId
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
        return {
            "itemSeqNum": 10 * (index + 1),
            "purchaseOrder": _.purchaseOrder ? _.purchaseOrder : "",
            "requestedDateTime": this.combineDateTime(preProduct).toISOString(),
            "currency": {
                "currencyCode": this.getCustomerCurrency()
            },
            "quantity": preProduct.quantity,
            "product": {
                "productId": preProduct.product.product.productId
            },
            "uom": {
                "unitId": preProduct.product.unitOfMeasure.unitId
            },
            "paymentTerm": {
                "paymentTermId": this.safePaymentTerm(preProduct)
            },
            "orderItemProfile": {
                "additionalServices": this.makeAdditionalServices(preProduct)
            }
        }
    }

    private makeAdditionalServices(preProduct): any[] {
        let additionalServices = []

        // Maneuvering
        if (preProduct.maneuvering) {
            additionalServices.push({ "additionalServiceCode": "MANEUVERING" });
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

    private combineDateTime(preProduct): Date {
        preProduct.date = new Date(preProduct.date);
        let year = preProduct.date.getFullYear()
        let month = preProduct.date.getMonth() + 1
        let day = preProduct.date.getDate()
        let dateStr = '' + year + '-' + month + '-' + day;
        return new Date(dateStr + ' ' + preProduct.time);
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

    // Map stuff
    // ====================
    makeJobsiteMarker(geo: any): google.maps.Marker {
        let marker = new google.maps.Marker({
            position: { lat: parseFloat(geo.latitude), lng: parseFloat(geo.longitude) },
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