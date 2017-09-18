import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslationService } from '../../shared/services/translation.service';
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

    constructor(private ppService: ProjectProfileApi, private sanitizer: DomSanitizer, private t: TranslationService) {
        this.fetchProjectProfiles();
    }

    openModal() {
        $("#app-content").addClass("blur");
    }

    fetchProjectProfiles() {
        this.ppService.all('354').subscribe((response) => {
            const profiles = response.json().profiles;
            if (profiles) {
                this.initData(response.json().profiles);
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

        this.rows = profiles.map((profile) => {
            return [
                { inner: profile.profileName }, 
                { inner: profile.project.projectProperties.dischargeTime && profile.project.projectProperties.dischargeTime.timePerDischargeDesc },
                { inner: profile.project.projectProperties.transportMethod.transportMethodDesc },
                { inner: profile.project.projectProperties.unloadType && profile.project.projectProperties.unloadType.unloadTypeDesc },
                { inner: profile.project.projectProperties.kicker, class: "capitalize" },
                { inner: "Extra hourts, Sundaly / Holiday" },
                { inner: this.sanitizer.bypassSecurityTrustHtml("<span data-toggle='modal' data-target='#pp-creator'>EDIT</span>"), class: "action-button", click: (item) => {
                    
                }, profile},
                { inner: "DELETE", class: "action-button", click: (item) => {
                    this.ppService.delete(item.profile.profileId).subscribe(res => res.ok && this.fetchProjectProfiles())
                }, profile },
            ]
        });
    }
}
