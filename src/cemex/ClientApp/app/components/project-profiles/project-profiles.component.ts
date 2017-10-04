import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';
import { ProjectProfileApi } from '../../shared/services/api'
import { CustomerService } from '../../shared/services/customer.service';
import { ModalService } from '../../shared/components/modal';


let $ = require("jquery");

@Component({
    selector: 'page-project-profiles',
    templateUrl: './project-profiles.html',
    styleUrls: ['./project-profiles.scss']
})
export class ProjectProfilesComponent {
    profiles = [];
    columns = [];
    rows = [];

    private loading = true;

    constructor(private ppService: ProjectProfileApi, private sanitizer: DomSanitizer, private t: TranslationService, private CustomerService: CustomerService, private modalService: ModalService) {
        this.CustomerService.customerSubject.subscribe((customer) => {
            if (customer) {
                this.fetchProjectProfiles(customer);
            }
        });

        this.columns = [
            //{ inner: '<i class="star cmx-icon-favourite-active" aria-hidden="true"></i>', width: 5 },
            { name: "Name", width: 25 },
            { name: "Discharge Time", width: 20 },
            { name: "Transport Method", width: 20 },
            { name: "Unload Type", width: 10 },
            { name: "Kicker", width: 10 },
            { name: "", width: 15, sortable: false },
        ]
    }

    closeModal(id: string){
        this.modalService.close(id);
    }

    openModal(id?: string) {
        this.modalService.open(id);
    }

    projectProfileCreated() {
        this.fetchProjectProfiles();
    }

    fetchProjectProfiles(customer = this.CustomerService.currentCustomer()) {
        this.loading = true;
        this.rows = [];
        const customerId = customer.legalEntityId;
        this.ppService.all(customerId).subscribe((response) => {
            this.loading = false;
            const profiles = response.json().profiles;
            if (profiles) {
                this.initData(response.json().profiles);
            }
        });
    }
    
    initData(profiles: any) {
        this.rows = profiles.map((profile) => {
            return [
                { inner: profile.profileName }, 
                { inner: profile.project.projectProperties.dischargeTime && profile.project.projectProperties.dischargeTime.timePerDischargeDesc },
                { inner: profile.project.projectProperties.transportMethod.transportMethodDesc },
                { inner: profile.project.projectProperties.unloadType && profile.project.projectProperties.unloadType.unloadTypeDesc },
                { inner: profile.project.projectProperties.kicker, class: "capitalize" },
                { inner: "DELETE", class: "action-button", click: (item) => {
                    this.ppService.delete(profile.profileId).subscribe(res => res.ok && this.fetchProjectProfiles())
                }},
            ]
        });
    }
}
