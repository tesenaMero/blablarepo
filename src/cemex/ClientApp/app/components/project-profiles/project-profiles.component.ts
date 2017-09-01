import { Component, OnInit } from '@angular/core';
import { ProjectProfileApiService } from '../../shared/services/project-profile-api.service'

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

    constructor(private ppService: ProjectProfileApiService) {
        this.ppService.all("4169").subscribe((response) => {
            if (response.json().profiles) {
                this.profiles = response.json().profiles;
                this.initData(this.profiles);
            }
        });
    }

    openModal() {
        $("#app-content").addClass("blur");
    }

    initData(profiles: any) {
        this.columns = [
            //{ inner: '<i class="star cmx-icon-favourite-active" aria-hidden="true"></i>', width: 5 },
            { name: "Name", width: 20 },
            { name: "Discharge Time", width: 10 },
            { name: "Transport Method", width: 10 },
            { name: "Unload Type", width: 10 },
            { name: "Kicker", width: 10 },
            { name: "Additional Services", width: 20 },
            { name: "", width: 5, sortable: false },
            { name: "", width: 10, sortable: false },
        ]
        
        this.profiles.forEach((profile) => {
            this.rows.push([
                { inner: profile.profileName }, 
                { inner: "20 min" },
                { inner: profile.project.projectProperties.transportMethod.transportMethodDesc },
                { inner: "Pump" },
                { inner: profile.project.projectProperties.kicker, class: "capitalize" },
                { inner: "Extra hourts, Sundaly / Holiday" },
                { inner: "EDIT", class: "action-button" },
                { inner: "DELETE", class: "action-button" },
            ]);
        });
    }
}
