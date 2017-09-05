import { Component, OnInit } from '@angular/core';
import { ProjectProfileApi } from '../../shared/services/api'

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

    constructor(private ppService: ProjectProfileApi) {
        this.fetchProjectProfiles();
    }

    openModal() {
        $("#app-content").addClass("blur");
    }

    fetchProjectProfiles() {
        this.profiles = [];
        this.ppService.all("4169").subscribe((response) => {
            if (response.json().profiles) {
                this.profiles = response.json().profiles;
                this.initData(this.profiles);
            }
        });
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
                { inner: profile.project.projectProperties.dischargeTime && profile.project.projectProperties.dischargeTime.timePerDischargeDesc },
                { inner: profile.project.projectProperties.transportMethod.transportMethodDesc },
                { inner: profile.project.projectProperties.unloadType && profile.project.projectProperties.unloadType.unloadTypeDesc },
                { inner: profile.project.projectProperties.kicker, class: "capitalize" },
                { inner: "Extra hourts, Sundaly / Holiday" },
                { inner: "EDIT", class: "action-button" },
                { inner: "DELETE", class: "action-button", click: (item) => {
                    this.ppService.delete(item.profile.profileId).subscribe(res => res.ok && this.fetchProjectProfiles())
                }, profile },
            ]);
        });
    }
}
