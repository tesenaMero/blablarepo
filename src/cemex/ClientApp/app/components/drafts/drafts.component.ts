import { Component, OnInit } from '@angular/core';
import { OrdersApi } from '../../shared/services/api';

import { TranslationService } from '@cemex-core/angular-services-v2/dist';

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
        this.ordersApi.all().subscribe((response) => {
            if (response.status == 200) {
                let orders: any[] = response.json().orders;
                // Filter drafts
                this.orders = orders.filter((item) => {
                    if (item.status) {
                        if (item.status.statusDesc)
                            return item.status.statusCode === "DRFT";                    
                    return true;
                    }
                });      
                let countryCode = JSON.parse(sessionStorage.getItem('user_legal_entity'));                
                // if Usa customer
                if (countryCode && countryCode.countryCode.trim() === "US"){            
                    this.initUsaCustomerOrders();
                }   
                else{
                    this.initOrders();
                }
            }
        });
    }

    ngOnInit() {
    }

    initOrders() {
        this.columns = [
            { name: this.t.pt('views.table.order_no'), width: 15 },
            { name: this.t.pt('views.table.submitted'), width: 15 },
            { name: this.t.pt('views.table.location'), width: 25 },
            { name: this.t.pt('views.table.pon'), width: 15 },
            { name: this.t.pt('views.table.products'), width: 10 },
            { name: this.t.pt('views.table.amount'), width: 10, sortable: false },
            { name: this.t.pt('views.table.request_date'), width: 20 },
            { name: this.t.pt('views.table.status'), width: 18 },
            { name: this.t.pt('views.table.total'), width: 13 },
        ]

        this.orders.forEach((order) => {
            this.rows.push([
                { inner: order.orderCode, class: "order-id", title: true },
                { inner: order.updatedDateTime, hideMobile: true },
                { inner: order.jobsite.jobsiteCode + " " + order.jobsite.jobsiteDesc, subtitle: true },
                { inner: order.purchaseOrder, hideMobile: true },
                { inner: "<i class='cmx-icon-track'></i>", hideMobile: true },
                { inner: order.totalQuantity + " tons" },
                { inner: order.requestedDateTime },
                { inner: "<span class='status " + order.status.statusDesc.toLowerCase() + "'></span>" + order.status.statusDesc, hideMobile: false },
                { inner: "$" + order.totalAmount, class: "roboto-bold" },
            ]);
        });
    }

    // Usa customer without amount
    initUsaCustomerOrders() {
        this.columns = [
            //{ inner: '<i class="star cmx-icon-favourite-active" aria-hidden="true"></i>', width: 5 },
            { name: this.t.pt('views.table.order_no'), width: 15 },
            { name: this.t.pt('views.table.submitted'), width: 15 },
            { name: this.t.pt('views.table.location'), width: 25 },
            { name: this.t.pt('views.table.pon'), width: 15 },
            { name: this.t.pt('views.table.products'), width: 10 },
            { name: this.t.pt('views.table.request_date'), width: 20 },
            { name: this.t.pt('views.table.status'), width: 18 },
        ]
        
        this.orders.forEach((order) => {
            order.status.statusDesc = order.status.statusDesc.substring(0, order.status.statusDesc.indexOf(' '));
            this.rows.push([
                { inner: order.orderCode, class: "order-id", title: true },
                { inner: order.updatedDateTime, hideMobile: true },
                { inner: order.jobsite.jobsiteCode + " " + order.jobsite.jobsiteDesc, subtitle: true },
                { inner: order.purchaseOrder, hideMobile: true },
                { inner: "<i class='cmx-icon-track'></i>", hideMobile: true },
                { inner: order.requestedDateTime },
                { inner: "<span class='status " + order.status.statusDesc.toLowerCase() + "'></span>" + order.status.statusDesc, hideMobile: false },
            ]);
        });
    }

    // initData() {
    //     this.columns = [
    //         //{ inner: '<i class="star cmx-icon-favourite-active" aria-hidden="true"></i>', width: 5 },
    //         { name: "Saved", width: 10 },
    //         { name: "Location", width: 10 },
    //         { name: "Purchase Order Number", width: 10 },
    //         { name: "Products", width: 10 },
    //         { name: "Amount", width: 10 },
    //         { name: "Requested date", width: 20 },
    //         { name: "Total amount", width: 10, sortable: false },
    //         { name: "", width: 5, sortable: false },
    //     ]

    //     this.rows = [
    //         [ 
    //             { inner: "08/13/2017" }, 
    //             { inner: "0864 Lonnie Parks" },
    //             { inner: "7755-KJ120/00011" },
    //             { inner: "<i class='cmx-icon-driver'></i>" },
    //             { inner: "10 tons" },
    //             { inner: "31/12/2017, 15:00 - 16:00" },
    //             { inner: "$72394.99" },
    //             { inner: "EDIT", class: "action-button" },
    //         ],
    //         [ 
    //             { inner: "11/30/2017" }, 
    //             { inner: "160 Kayleigh Tunnel" },
    //             { inner: "1255-KJ120/00011" },
    //             { inner: "<i class='cmx-icon-track'></i>" },
    //             { inner: "11 tons" },
    //             { inner: "31/12/2017, 15:00 - 16:00" },
    //             { inner: "$35998.81", class: "roboto-bold" },
    //             { inner: "EDIT", class: "action-button" },
    //         ]
    //     ]
    // }
}
