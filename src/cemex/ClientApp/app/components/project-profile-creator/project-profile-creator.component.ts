import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CatalogApi, ProjectProfileApi } from '../../shared/services/api';
import { CustomerService } from '../../shared/services/customer.service';

@Component({
    selector: 'project-profile-creator',
    templateUrl: './project-profile-creator.html',
    styleUrls: ['./project-profile-creator.scss']
})
export class ProjectProfileCreatorComponent {
    @Output() canceled = new EventEmitter<any>();
    @Output() confirmed = new EventEmitter<any>();

    private finishedOrder: boolean;
    private loadingCatalog: boolean;
    private isUnloadTypePump: boolean;
    private catalogs: any = {};
    private projectProfile: any = {
        profileName: '',
        project: {
            projectProperties: {
                transportMethod: {
                    transportMethodId: 1
                },
                kicker: true
            }
        }
    };


    constructor(private CatalogApi: CatalogApi, private ProjectProfileApi: ProjectProfileApi, private CustomerService: CustomerService) {
        this.loadingCatalog = true;
        const customerId = CustomerService.currentCustomer().legalEntityId || 354;
        this.CatalogApi.byProductLine(customerId, '0006').map((response) => response.json()).subscribe((response) => {
            response.catalogs.forEach((catalog) => {
                this.catalogs[catalog.catalogCode] = catalog.entries;
            });
            this.loadingCatalog = false;
        });
    }

    confirm() {
        const customerId = this.CustomerService.currentCustomer().legalEntityId || 354;
        this.ProjectProfileApi.create({ ...this.projectProfile, customer: { customerId: customerId }}, customerId)
            .map((response) => response.json())
            .subscribe((response) => {
                console.log(response);
        });
        this.finishedOrder = true;
    }

    cancel() {
        this.finishedOrder = false;
        this.canceled.emit();
    }

    onChangeUnloadType(index) {
        const entry = this.catalogs.ULT[index];
        this.projectProfile.project.projectProperties.unloadType = { unloadTypeId: entry.entryId };
        delete this.projectProfile.project.projectProperties.pumpCapacity;
        this.isUnloadTypePump = entry.entryCode === 'Pump';
    }

    onChangePumpCapacity(value) {
        this.projectProfile.project.projectProperties.pumpCapacity = { pumpCapacityId: Number(value) };
    }

    onChangeDischargeTime(value) {
        this.projectProfile.project.projectProperties.dischargeTime = { dischargeTimeId: Number(value) };
    }
}
