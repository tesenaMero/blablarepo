import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Api } from './api.service';
import { CustomerService } from '../customer.service'

@Injectable()
export class ShipmentLocationApi {
    constructor(private api: Api, private customerService: CustomerService) {
    }

    getShipmentLocationType() {
        return this.api.get('/v1/im/shipmentlocationtypes');
    }

    locationTypes() {
        return this.api.get('/v1/im/shipmentlocationtypes');
    }

    all(shipmentLocationTypes, productLine): Observable<Response> {
        const customerId = this.customerService.currentCustomer().legalEntityId;
        // const locationType = shipmentLocationTypes.find(item => item.shipmentLocationTypeCode === 'J');
        return this.api.get(`/v4/sm/myshipmentlocations?legalEntityId=${customerId}.1&shipmentLocationTypeId=2&productLineId=${productLine.productLineId}`);
    }

    jobsites(productLine) {
        return this.locationTypes()
        .map(types => types.json().shipmentLocationTypes)
        .flatMap((types) => {
            // let type = types.find(item => item.shipmentLocationTypeCode === 'J');
            let customerId = this.customerService.currentCustomer().legalEntityId;
            return this.api.get(`/v4/sm/myshipmentlocations?legalEntityId=${customerId}.1&shipmentLocationTypeId=2&productLineId=${productLine.productLineId}`)
        })
        .map(jobsites => jobsites);
    }

    pods(shipmentLocation: any, shipmentLocationTypes, legalEntityId?, productLine?): Observable<Response> {
        // 'myshipmentlocations?legalEntityId=122.1&shipmentLocationTypeId=3&productLineId=2'
        // "/v4/sm/myshipmentlocations?shipmentlocationId=" +   
        // shipmentLocation.shipmentLocationId + "." + 
        // shipmentLocation.shipmentLocationType.shipmentLocationTypeId + "&" +
        // "shipmentLocationTypeId=6"
        // const locationType = shipmentLocationTypes.find(item => item.shipmentLocationTypeCode === 'P');
        return this.api.get(
            `/v4/sm/myshipmentlocations?shipmentlocationId=${shipmentLocation.shipmentLocationId}.2&shipmentLocationTypeId=3&productLineId=${productLine.productLineId}`
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
        return this.api.get(address.geoPlace.links.self);
    }

    contacts(shipmentLocation: any): Observable<Response> {
        return this.api.get("/v1/crm/jobsitecontacts?jobsiteId=" + shipmentLocation.shipmentLocationId);
    }

}