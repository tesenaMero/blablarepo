import { Component, OnInit, ViewChild } from '@angular/core';
import { SessionService } from '../../shared/services/session.service';
import { Router } from '@angular/router';
import { CreateOrderService } from '../../shared/services/create-order.service';
import { DashboardService } from '../../shared/services/dashboard.service'
import { CustomerService } from '../../shared/services/customer.service'
import { LegalEntitiesApi, SalesDocumentApi, ShipmentLocationApi } from '../../shared/services/api';

import { TranslationService } from '../../shared/services/translation.service';

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
        private legalEnitityApi: LegalEntitiesApi,
        private customerService: CustomerService,
        private salesDocumentService: SalesDocumentApi
    ) { }

    ngOnInit() {
        // Fetch locations types:
        // 'J': Jobsite, ...
        this.shipmentLocationApi.fetchShipmentLocationTypes();
        this.dashboard.alertSubject.subscribe((alert) => this.handleAlert(alert));

        this.legalEnitityApi.all().subscribe((response) => {
            let legalEntities = response.json().legalEntities
            this.customers = legalEntities;
            this.customerService.setAvailableCustomers(legalEntities);
            this.customerService.setCustomer(legalEntities[0]);
        });

        // this.salesDocumentService.all().subscribe((response) => {
        //     console.log(response.json());
        // });

        this.initLanguage();
    }

    private initLanguage() {
        this.langSelected = localStorage.getItem('Language') || 'en';
        this.t.lang(this.langSelected);
        localStorage.setItem('Language', this.langSelected);
    }

    private changeLanguage(lang: any) {
        this.t.lang(lang);
        this.langSelected = lang;
        localStorage.setItem('Language', lang);
        //this.eventDispatcher.broadcast(this.CHANGE_LANGUAGE, lang);
    }

    private handleAlert(alert: any) {
        if (alert == null) { this.closeAlert(); return; }

        this.showAlert = false;
        this.alert.text = alert.text;
        this.alert.type = alert.type;
        this.showAlert = true;

        if (alert.duration != 0) {
            setTimeout(() => {
                this.showAlert = false;
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
        this.router.navigate(['/login']);
    }

    private setCustomer(customer: any) {
        this.customerService.setCustomer(customer);
    }

    private clickMenuButton(event: any) {
        this.sidebar.isCollapsed = !this.sidebar.isCollapsed;
    }
}