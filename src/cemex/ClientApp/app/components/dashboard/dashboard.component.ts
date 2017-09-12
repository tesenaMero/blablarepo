import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../shared/services/session.service';
import { Router } from '@angular/router';
import { ShipmentLocationApi } from '../../shared/services/api/shipment-locations.service.api';
import { CreateOrderService } from '../../shared/services/create-order.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

    constructor(
        private session: SessionService,
        private createOrderService: CreateOrderService,
        private router: Router,
        private shipmentLocationApi: ShipmentLocationApi
    ) { }

    ngOnInit() {
        this.shipmentLocationApi.getShipmentLocationType();
        this.createOrderService.fetchShipmentLocation();
    }

    logout() {
        this.session.logout();
        this.router.navigate(['/login']);
    }

}