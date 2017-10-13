import { Component, OnInit, ViewChild } from '@angular/core';
import { SessionService } from '../../shared/services/session.service';
import { Router } from '@angular/router';
import { CreateOrderService } from '../../shared/services/create-order.service';
import { DashboardService } from '../../shared/services/dashboard.service'
import { CustomerService } from '../../shared/services/customer.service'
import { SalesDocumentApi, ShipmentLocationApi } from '../../shared/services/api';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';
import { CmxSidebarComponent } from '@cemex/cmx-sidebar-v1/dist';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

    @ViewChild(CmxSidebarComponent)
    private sidebar: CmxSidebarComponent;

    private showAlert = false;
    private alertTimeout: any;
    private alert = {
        text: "",
        type: "info"
    };

    private customers: any[];
    // langSelected: string;

    constructor(
        private session: SessionService,
        private createOrderService: CreateOrderService,
        private router: Router,
        private shipmentLocationApi: ShipmentLocationApi,
        private dashboard: DashboardService,
        private customerService: CustomerService,
        private salesDocumentService: SalesDocumentApi
    ) { }

    ngOnInit() {
        // Fetch locations types:
        // 'J': Jobsite, ...
        this.shipmentLocationApi.fetchShipmentLocationTypes();
        this.salesDocumentService.fetchSalesDocuments();
        this.dashboard.alertSubject.subscribe((alert) => this.handleAlert(alert));
    }

    private handleAlert(alert: any) {
        if (alert == null) { this.closeAlert(); return; }

        this.showAlert = false;
        this.alert.text = alert.text;
        this.alert.type = alert.type;
        setTimeout(() => { this.showAlert = true }, 0);

        if (alert.duration === 0) {
            if (this.alertTimeout) { clearTimeout(this.alertTimeout); }
            this.showAlert = true;
        }
        else {
            if (this.alertTimeout) { clearTimeout(this.alertTimeout); }
            this.alertTimeout = setTimeout(() => {
                this.showAlert = false;
            }, alert.duration);
        }
    }

    private closeAlert() {
        this.showAlert = false;
    }

    private alertClass(alert) {
        if (alert.type === "success") { return "cmx-green"; }
        else if (alert.type === "warning") { return "cmx-yellow"; }
        else if (alert.type === "error") { return "cmx-red"; }
        else if (alert.type === "info") { return "cmx-blue"; }
        else { return "cmx-blue"; }
    }

    private logout() {
        this.session.logout();
        localStorage.removeItem('manager');
        this.router.navigate(['/ordersnproduct/app/login']);
    }

    private setCustomer(customer: any) {
        this.customerService.setCustomer(customer);
    }

    private clickMenuButton(event: any) {
        this.sidebar.isCollapsed = !this.sidebar.isCollapsed;
    }
}