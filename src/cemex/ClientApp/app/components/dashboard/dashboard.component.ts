import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
    private shouldResetAlert = false;
    private alert = {
        text: "",
        type: "info"
    };

    private customers: any[];
    langSelected: string = 'en';

    constructor(
        private t: TranslationService,
        private session: SessionService,
        private createOrderService: CreateOrderService,
        private router: Router,
        private shipmentLocationApi: ShipmentLocationApi,
        private dashboard: DashboardService,
        private customerService: CustomerService,
        private salesDocumentService: SalesDocumentApi,
        private __: ChangeDetectorRef
    ) { }

    ngOnInit() {
        // Fetch locations types:
        // 'J': Jobsite, ...
        this.shipmentLocationApi.fetchShipmentLocationTypes();
        this.dashboard.alertSubject.subscribe((alert) => this.handleAlert(alert));

        // this.salesDocumentService.all().subscribe((response) => {
        //     console.log(response.json());
        // });

        this.initLanguage();
    }

    private initLanguage() {
        this.changeLanguage(localStorage.getItem('Language') || 'en');
    }

    private changeLanguage(lang: any) {
        this.t.lang(lang);
        this.langSelected = lang;
        localStorage.setItem('Language', lang);
    }

    private handleAlert(alert: any) {
        if (alert == null) { this.closeAlert(); return; }

        const alertOpened = this.alert && this.showAlert
        if (alertOpened) { this.shouldResetAlert = true }
        else { this.shouldResetAlert = false; }

        this.showAlert = false;
        this.alert.text = alert.text;
        this.alert.type = alert.type;
        this.showAlert = true;

        if (alert.duration != 0) {
            setTimeout(() => {
                if (!this.shouldResetAlert) {
                    this.showAlert = false;
                }
            }, alert.duration);
        }
        else {
            this.showAlert = true;
        }
    }

    private closeAlert() {
        this.showAlert = false;
    }

    private alertClass(alert) {
        if (alert.type == "success") { return "cmx-green"; }
        else if (alert.type == "warning") { return "cmx-yellow"; }
        else if (alert.type == "error") { return "cmx-red"; }
        else if (alert.type == "info") { return "cmx-blue"; }
        else { return "cmx-blue"; }
    }

    private logout() {
        this.session.logout();
        this.router.navigate(['/ordersnproduct/app/login']);
    }

    private setCustomer(customer: any) {
        this.customerService.setCustomer(customer);
    }

    private clickMenuButton(event: any) {
        this.sidebar.isCollapsed = !this.sidebar.isCollapsed;
    }
}