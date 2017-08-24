import { Component, OnInit } from '@angular/core';

let $ = require("jquery");

@Component({
    selector: 'page-project-profiles',
    templateUrl: './project-profiles.html',
    styleUrls: ['./project-profiles.scss']
})
export class ProjectProfilesComponent {
    columns: any;
    rows: any;

    constructor() {
        this.initData();
    }

    openModal() {
        $("#app-content").addClass("blur");
    }

    initData() {
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

        this.rows = [
            [ 
                { inner: "My First Project Profile" }, 
                { inner: "20 min" },
                { inner: "Truck" },
                { inner: "Pump" },
                { inner: "Yes" },
                { inner: "Extra hourts, Sundaly / Holiday" },
                { inner: "EDIT", class: "action-button" },
                { inner: "DELETE", class: "action-button" },
            ],
            [ 
                { inner: "My Second Project Profile" }, 
                { inner: "20 min" },
                { inner: "Truck" },
                { inner: "Pump" },
                { inner: "No" },
                { inner: "Extra hourts, Sundaly / Holiday" },
                { inner: "EDIT", class: "action-button" },
                { inner: "DELETE", class: "action-button" },
            ]
        ]
    }
}
