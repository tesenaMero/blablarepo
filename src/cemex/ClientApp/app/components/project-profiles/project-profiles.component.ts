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
    isMX: boolean = false;
    createProfileOpened = false

    private loading = true;

    constructor(private ppService: ProjectProfileApi, private sanitizer: DomSanitizer, private t: TranslationService, private CustomerService: CustomerService, private modalService: ModalService) {
        this.CustomerService.customerSubject.subscribe((customer) => {
            if (customer) {
                this.fetchProjectProfiles(customer);
                if ((customer.countryCode).trim() === 'MX') {
                    this.isMX = true;
                } else {
                    this.isMX = false;
                }
            }

            this.columns = [
                //{ inner: '<i class="star cmx-icon-favourite-active" aria-hidden="true"></i>', width: 5 },
                { name: this.t.pt('views.project.profile.table_name'), width: 25 },
                { name: this.t.pt('views.project.profile.table_element'), width: 20 },
                { name: this.t.pt('views.project.profile.table_time_per_load'), width: 20 },
                { name: this.t.pt('views.project.profile.table_load_size'), width: 10 },
                { name: this.t.pt('views.project.profile.table_kicker'), width: 10 },
                { name: "", width: 15, sortable: false },
            ]
        });
    }

    closeModal(id: string) {
        this.modalService.close(id);
        this.createProfileOpened = false
    }

    openModal(id?: string) {
        this.createProfileOpened = true
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
            const projectProperties = profile.project.projectProperties;
            return [
                { inner: profile.profileName },
                { inner: projectProperties.element ? profile.project.projectProperties.element.elementCode : "--" },
                { inner: projectProperties.timePerLoad ? profile.project.projectProperties.timePerLoad.timePerLoadDesc : "--" },
                { inner: projectProperties.loadSize ? profile.project.projectProperties.loadSize.loadSizeDesc : "--" },
                { inner: projectProperties.kicker, class: "capitalize" },
                {
                    inner: "DELETE", class: "action-button", click: (item) => {
                        this.ppService.delete(profile.profileId).subscribe(res => res.ok && this.fetchProjectProfiles())
                    }
                },
            ]
        });
    }
}
