import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Api } from './api.service';
import { CustomerService } from '../customer.service'

@Injectable()
export class ShipmentLocationApi {
    shipmentLocationTypes = new BehaviorSubject<any>(undefined);

    constructor(private api: Api, private customerService: CustomerService) {
    }

    // Subjects
    // --------------------------------------------------------
    fetchShipmentLocationTypes() {
        this.getShipmentLocationTypes()
            .map(response => response.json().shipmentLocationTypes)
            .subscribe(response => {
                this.shipmentLocationTypes.next(response);
            })
    }

    // Observables
    // --------------------------------------------------------
    getShipmentLocationTypes() {
        return this.api.get('/v1/im/shipmentlocationtypes');
    }

    locationTypes() {
        return this.api.get('/v1/im/shipmentlocationtypes');
    }

    all(productLine): Observable<Response> {
        let customerId = this.customerService.currentCustomer().legalEntityId;
        let locationType = this.shipmentLocationTypes.getValue() && this.shipmentLocationTypes.getValue().find(item => item.shipmentLocationTypeCode === 'J');

        // If locations type already defined
        if (locationType) {
            return this.api.get(`/v4/sm/myshipmentlocations?legalEntityId=${customerId}.1&shipmentLocationTypeId=${locationType.shipmentLocationTypeId}&productLineId=${productLine.productLineId}&orderBlocked=false`);
        }

        // Fetch location types then jobsites
        else {
            return this.getShipmentLocationTypes()
            .map(response => response.json().shipmentLocationTypes)
            .flatMap((types) => {
                locationType = types && types.find(item => item.shipmentLocationTypeCode === 'J');

                return this.api.get(`/v4/sm/myshipmentlocations?legalEntityId=${customerId}.1&shipmentLocationTypeId=${locationType.shipmentLocationTypeId}&productLineId=${productLine.productLineId}&orderBlocked=false`);
            })
        }
    }

    pods(shipmentLocation: any, productLine?): Observable<Response> {
        const locationType = this.shipmentLocationTypes.getValue() && this.shipmentLocationTypes.getValue().find(item => item.shipmentLocationTypeCode === 'P');

        return this.api.get(
            `/v4/sm/myshipmentlocations?shipmentlocationId=${shipmentLocation.shipmentLocationId}.2&shipmentLocationTypeId=${locationType.shipmentLocationTypeId}&productLineId=${productLine.productLineId}`
        );
    }

    // Chain combines address() + geo()
    salesAreas(shipmentLocation: any, productLine): Observable<Response> {
        return this.api.get("/v4/sm/jobsitesalesareas?shipmentLocationId=" + shipmentLocation.shipmentLocationId + ".2&productLineId=" + productLine.productLineId)
    }

    // Chain combines address() + geo()
    jobsiteGeo(shipmentLocation: any): Observable<Response> {
        return this.address(shipmentLocation)
            .flatMap((address) => { return this.geo(address.json()); })
            .map(geo => geo);
    }

    address(shipmentLocation: any): Observable<Response> {
        return this.api.get(shipmentLocation.address.links.self);
    }

    geo(address: any): Observable<Response> {
        //return this.api.get(address.geoPlace.links.self);
        const geoPlace = address && address.geoPlace && address.geoPlace.links && address.geoPlace.links.self || undefined
        if (geoPlace) { return this.api.get(geoPlace); }
        else { return Observable.empty<Response>(); }
    }

    // contacts(shipmentLocation: any): Observable<Response> {
    //     return this.api.get("/v1/crm/jobsitecontacts?jobsiteId=" + shipmentLocation.shipmentLocationId);
    // }

    contacts(shipmentLocation: any): Observable<Response> {
        const customerId = this.customerService.currentCustomer().legalEntityId; 
        return this.api.get(`/v2/crm/mycontacts?customerId=${customerId}&jobsiteId=${shipmentLocation.shipmentLocationId}&contactType=jobsite,customer`); 
    }

}