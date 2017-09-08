import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Api } from './api.service';

@Injectable()
export class ShipmentLocationApi {
    constructor(private api: Api) {
    }

    all(): Observable<Response> {
        return this.api.get("/v4/sm/myshipmentlocations");
    }

    pods(shipmentLocation: any): Observable<Response> {
        return this.api.get(
            "/v4/sm/myshipmentlocations?shipmentlocationId=" + 
            shipmentLocation.shipmentLocationId + "." + 
            shipmentLocation.shipmentLocationType.shipmentLocationTypeId + "&" +
            "shipmentLocationTypeId=6"
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