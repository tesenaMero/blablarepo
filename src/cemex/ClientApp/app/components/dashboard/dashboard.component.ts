import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../shared/services/session.service';
import { Router } from '@angular/router';
import { ShipmentLocationApi } from '../../shared/services/api/shipment-locations.service.api';
import { CreateOrderService } from '../../shared/services/create-order.service';
import { DashboardService } from '../../shared/services/dashboard.service'
import { CustomerService } from '../../shared/services/customer.service'
import { LegalEntitiesApi } from '../../shared/services/api/legal-entities.service'

import { TranslationService } from '../../shared/services/translation.service';

import { Broadcaster } from '../../shared/types/broadcaster';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.html',
    providers: [TranslationService, Broadcaster],
    styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
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
    ) { }

    ngOnInit() {
        this.createOrderService.fetchShipmentLocation();
        this.dashboard.alertSubject.subscribe((alert) => this.handleAlert(alert));
        this.legalEnitityApi.all().subscribe((response) => {
            let legalEntities = response.json().legalEntities
            this.customers = legalEntities;
            this.customerService.setAvailableCustomers(legalEntities);
            this.customerService.setCustomer(legalEntities[0]);
        });
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
}

class Language {
    flagPath: string;
    id: string;
    text: string;
    constructor(flagPath: string, id: string, text: string) {
      this.flagPath = flagPath;
      this.id = id;
      this.text = text;
    }
  }