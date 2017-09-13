import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../shared/services/session.service';
import { Router } from '@angular/router';
import { ShipmentLocationApi } from '../../shared/services/api/shipment-locations.service.api';
import { CreateOrderService } from '../../shared/services/create-order.service';
import { DashboardService } from '../../shared/services/dashboard.service'

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
    private showAlert = false;
    private alert = {
        text: "",
        type: "info" 
    };

    constructor(
        private session: SessionService,
        private createOrderService: CreateOrderService,
        private router: Router,
        private shipmentLocationApi: ShipmentLocationApi,
        private dashboard: DashboardService
    ) { }

    ngOnInit() {
        this.createOrderService.fetchShipmentLocation();
        this.dashboard.alertSubject.subscribe((alert) => this.handleAlert(alert));
    }

    private handleAlert(alert: any) {
        this.showAlert = false;
        this.alert.text = alert.text;
        this.alert.type = alert.type;
        this.showAlert = true;
        setTimeout(() => {
            this.showAlert = false;
        }, 6000);
    }

    private closeAlert() {
        this.showAlert = false;
    }

    private alertClass(alert) {
        if (alert.type == "success") {
            return "cmx-green";
        }
        else {
            return "cmx-blue";
        }
    }

    private logout() {
        this.session.logout();
        this.router.navigate(['/login']);
    }
}