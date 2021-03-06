import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';
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
    @Input() viewMode;

    public isMX: boolean = false;
    private postingTheOrder: boolean;
    private finishedOrder: boolean;
    private loadingCatalog: boolean;
    private isUnloadTypePump: boolean;
    private projectProfileNameFilled: boolean = false;
    private catalogs: any = {};

    @Input()
    private projectProfile: any = {
        profileName: '',
        project: {
            projectProperties: {
                kicker: false
            }
        }
    };


    // CustomerService.currentCustomer().legalEntityId || 
    constructor(private CatalogApi: CatalogApi, private ProjectProfileApi: ProjectProfileApi, private CustomerService: CustomerService, private t: TranslationService) {
        this.CustomerService.customerSubject.subscribe((customer) => {
            if (customer) {
                this.loadingCatalog = true;
                const customerId = customer.legalEntityId;

                if ((customer.countryCode).trim() === 'MX') {
                    this.isMX = true;
                } else {
                    this.isMX = false;
                }

                let sub = this.CatalogApi.byProductLine(customerId, '0006').map((response) => response.json()).subscribe((response) => {
                    response.catalogs.forEach((catalog) => {
                        this.catalogs[catalog.catalogCode] = catalog.entries;
                    });
                    this.loadingCatalog = false;

                    sub.unsubscribe();
                });
            }
        });
    }

    confirm() {
        // this.CustomerService.currentCustomer().legalEntityId
        if(this.projectProfileNameFilled) {
        this.postingTheOrder = true;
        const customerId = this.CustomerService.currentCustomer().legalEntityId;
        this.ProjectProfileApi.create({ ...this.projectProfile, customer: { customerId } }, customerId)
            .map((response) => response.json())
            .subscribe((response) => {
                this.postingTheOrder = false;
                this.finishedOrder = true;
                this.confirmed.emit();
            });
        }

    }

    projectProfileNameChanged(target) {
        console.log(target)
        if (target) {
            this.projectProfileNameFilled = true
        }
    }

    cancel() {
        this.finishedOrder = false;
        this.canceled.emit();
    }

    onChangeKicker(value: Boolean) {
        this.projectProfile.project.projectProperties.kicker = Boolean(value);
    }

    onChangeUnloadType(index) {
        if (index === "null") {
            delete this.projectProfile.project.projectProperties.unloadType;
            if (this.isUnloadTypePump) {
                delete this.projectProfile.project.projectProperties.pumpCapacity;
                this.isUnloadTypePump = false;
            }
        } else {
            const entry = this.catalogs.ULT[index];
            this.projectProfile.project.projectProperties.unloadType = { unloadTypeId: entry.entryId };
            delete this.projectProfile.project.projectProperties.pumpCapacity;
            this.isUnloadTypePump = entry.entryCode === 'Pump';
        }
    }

    onChangePumpCapacity(value) {
        this.projectProfile.project.projectProperties.pumpCapacity = { pumpCapacityId: Number(value) };
    }

    onChangeDischargeTime(value) {
        this.projectProfile.project.projectProperties.dischargeTime = { dischargeTimeId: Number(value) };
        if (value === "null") {
            delete this.projectProfile.project.projectProperties.dischargeTime;
        }
    }

    onChangeApplicationType(value) {
        this.projectProfile.project.projectProperties.element = { elementId: Number(value) };
        if (value === "null") {
            delete this.projectProfile.project.projectProperties.element;
        }
    }

    onChangeSpacing(value) {
        this.projectProfile.project.projectProperties.timePerLoad = { timePerLoadId: Number(value) };
        if (value === "null") {
            delete this.projectProfile.project.projectProperties.timePerLoad;
        }
    }

    onChangeLoadSize(value) {
        this.projectProfile.project.projectProperties.loadSize = { loadSizeId: Number(value) };
        if (value === "null") {
            delete this.projectProfile.project.projectProperties.loadSize;
        }
    }

    onChangeTransportMethod(value) {
        this.projectProfile.project.projectProperties.transportMethod = { transportMethodId: Number(value) };
        if (value === "null") {
            delete this.projectProfile.project.projectProperties.transportMethod;

        }
    }
}
