import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CatalogApi } from '../../shared/services/api';

@Component({
    selector: 'project-profile-creator',
    templateUrl: './project-profile-creator.html',
    styleUrls: ['./project-profile-creator.scss']
})
export class ProjectProfileCreatorComponent {
    @Output() canceled = new EventEmitter<any>();
    @Output() confirmed = new EventEmitter<any>();

    private finishedOrder: boolean;
    private catalogs = {};

    constructor(private CatalogApi: CatalogApi) {
        this.CatalogApi.byProductLine('4169', '0006').map((response) => response.json()).subscribe((response) => {
            response.catalogs.forEach((catalog) => {
                this.catalogs[catalog.catalogCode] = catalog.entries;
            });
        });
    }

    confirm() {
        this.finishedOrder = true;
    }

    cancel() {
        this.finishedOrder = false;
        this.canceled.emit();
    }
}
