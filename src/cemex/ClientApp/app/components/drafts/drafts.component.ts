import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'page-drafts',
    templateUrl: './drafts.html',
    styleUrls: ['./drafts.scss']
})
export class DraftsComponent implements OnInit {
    columns: any;
    rows: any;

    constructor() {
        this.initData();
    }

    ngOnInit() {
    }

    initData() {
        this.columns = [
            //{ inner: '<i class="star cmx-icon-favourite-active" aria-hidden="true"></i>', width: 5 },
            { name: "Saved", width: 10 },
            { name: "Location", width: 10 },
            { name: "Purchase Order Number", width: 10 },
            { name: "Products", width: 10 },
            { name: "Amount", width: 10 },
            { name: "Requested date", width: 20 },
            { name: "Total amount", width: 10, sortable: false },
            { name: "", width: 5, sortable: false },
        ]

        this.rows = [
            [ 
                { inner: "08/13/2017" }, 
                { inner: "0864 Lonnie Parks" },
                { inner: "7755-KJ120/00011" },
                { inner: "<i class='cmx-icon-driver'></i>" },
                { inner: "10 tons" },
                { inner: "31/12/2017, 15:00 - 16:00" },
                { inner: "$72394.99" },
                { inner: "EDIT", class: "action-button" },
            ],
            [ 
                { inner: "11/30/2017" }, 
                { inner: "160 Kayleigh Tunnel" },
                { inner: "1255-KJ120/00011" },
                { inner: "<i class='cmx-icon-track'></i>" },
                { inner: "11 tons" },
                { inner: "31/12/2017, 15:00 - 16:00" },
                { inner: "$35998.81", class: "roboto-bold" },
                { inner: "EDIT", class: "action-button" },
            ]
        ]
    }
}
