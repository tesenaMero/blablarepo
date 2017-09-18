import { Component, OnInit } from '@angular/core';
import { OrdersApi } from '../../shared/services/api';

import { TranslationService } from '../../shared/services/translation.service';

@Component({
    selector: 'page-drafts',
    templateUrl: './drafts.html',
    styleUrls: ['./drafts.scss']
})
export class DraftsComponent implements OnInit {
    columns: any[] = [];
    rows: any[] = [];
    orders: any;

    constructor(private ordersApi: OrdersApi, private t: TranslationService) {
        this.ordersApi.all('4169', 100).subscribe((response) => {
            this.orders = response.json().orders.slice(0, 10);
            // console.log(this.orders);
            //this.initOrders();
        });
        
        this.initData();
    }

    ngOnInit() {
        
    }

    initOrders() {
        this.columns = [
            //{ inner: '<i class="star cmx-icon-favourite-active" aria-hidden="true"></i>', width: 5 },
            { name: "Order No", width: 15 },
            { name: "Submitted", width: 15 },
            { name: "Location", width: 25 },
            { name: "Puchase Order Number", width: 15 },
            { name: "Products", width: 10 },
            { name: "Amount", width: 10, sortable: false },
            { name: "Requested date", width: 20 },
            { name: "Status", width: 18 },
            { name: "Total amount", width: 13 },
        ]
        
        this.orders.forEach((order) => {
            order.status.statusDesc = order.status.statusDesc.substring(0, order.status.statusDesc.indexOf(' '));
            this.rows.push([
                { inner: order.orderCode, class: "order-id", title: true },
                { inner: order.updatedDateTime, hideMobile: true },
                { inner: order.jobsite.jobsiteCode + " " + order.jobsite.jobsiteDesc, subtitle: true },
                { inner: order.purchaseOrder, hideMobile: true },
                { inner: "<i class='cmx-icon-track'></i>", hideMobile: true },
                { inner: order.totalQuantity + " tons"},
                { inner: order.requestedDateTime },
                { inner: "<span class='status " + order.status.statusDesc.toLowerCase() + "'></span>" + order.status.statusDesc, hideMobile: false },
                { inner: "$" + order.totalAmount, class: "roboto-bold" },
                // { inner: "<span class='status " + order.status.statusDesc.toLowerCase() + "'></span>" + order.status.statusDesc, hideDesktop: true },
            ]);
        });
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
