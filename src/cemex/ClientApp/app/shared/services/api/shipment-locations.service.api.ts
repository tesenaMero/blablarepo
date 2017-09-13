import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class ShipmentLocationApi {
    constructor(private api: Api) {
    }

    getShipmentLocationType() {
        return this.api.get('/v1/im/shipmentlocationtypes');
    }

    all(shipmentLocationTypes, productLine): Observable<Response> {
        const customerId = 354;
        const locationType = shipmentLocationTypes.find(item => item.shipmentLocationTypeCode === 'J');
        return this.api.get(`/v4/sm/myshipmentlocations?legalEntityId=${customerId}.1&shipmentLocationTypeId=${locationType.shipmentLocationTypeId}&productLineId=${productLine.productLineId}`);
    }

    pods(shipmentLocation: any, shipmentLocationTypes, legalEntityId?, productLine?): Observable<Response> {
        // 'myshipmentlocations?legalEntityId=122.1&shipmentLocationTypeId=3&productLineId=2'
        // "/v4/sm/myshipmentlocations?shipmentlocationId=" + 
        // shipmentLocation.shipmentLocationId + "." + 
        // shipmentLocation.shipmentLocationType.shipmentLocationTypeId + "&" +
        // "shipmentLocationTypeId=6"
        const locationType = shipmentLocationTypes.find(item => item.shipmentLocationTypeCode === 'P');
        return this.api.get(
            `/v4/sm/myshipmentlocations?shipmentlocationId=${shipmentLocation.shipmentLocationId}.2&shipmentLocationTypeId=${locationType.shipmentLocationTypeId}&productLineId=${productLine.productLineId}`
        );
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