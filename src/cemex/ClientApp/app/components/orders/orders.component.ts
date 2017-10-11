import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';

import { OrdersService } from '../../shared/services/orders.service';
import { PingSalesOrderApi } from '../../shared/services/api/ping-sales-order.service';
import { OrderRequestTableComponentConfiguration } from '../../utils/order-request.helper';
import { DashboardService } from '../../shared/services/dashboard.service';
import { CustomerService } from '../../shared/services/customer.service';
import { OrdersApi } from '../../shared/services/api/orders.service';
import { EncodeDecodeJsonObjService } from '../../shared/services/encodeDecodeJsonObj.service';
import * as moment from 'moment'

@Component({
    selector: 'page-orders',
    templateUrl: './orders.html',
    styleUrls: ['./orders.scss']
})
export class OrdersComponent implements OnInit {
    orders: any = [];

    isLoading: any;
    totalPages: any;
    customer: any;

    columns: any[] = [];
    rows: any[] = [];

    public orderRequestConfiguration: OrderRequestTableComponentConfiguration;

    constructor(private ordersService: OrdersService, private t: TranslationService, private ping: PingSalesOrderApi, private dash: DashboardService, private router: Router, private customerService: CustomerService, private ordersApi: OrdersApi, private encDecJsonObjService: EncodeDecodeJsonObjService) {
        //this.orders = ordersService.getOrders();
        //this.isLoading = ordersService.isLoading();
        //this.orderRequestConfiguration = OrdersService.ORDER_REQUEST_MAPPING;
        //this.totalPages = ordersService.getTotalPages();

        this.isLoading = true;
        this.ordersApi.all().subscribe((response) => {
            if (response.status == 200) {
                let orders: any[] = response.json().orders;

                // Filter drafts
                this.orders = orders.filter((item) => {
                    if (item.status) {
                        if (item.status.statusDesc)
                            return item.status.statusCode != "DRFT";
                    
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
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
        });
    }

    ngOnInit() {
    }

    initOrders() {
        this.columns = [
            //{ inner: '<i class="star cmx-icon-favourite-active" aria-hidden="true"></i>', width: 5 },
            { name: this.t.pt('views.table.order_no'), width: 15 },
            { name: this.t.pt('views.table.submitted'), width: 15 },
            { name: this.t.pt('views.table.location'), width: 25 },
            { name: this.t.pt('views.table.pon'), width: 15 },
            { name: this.t.pt('views.table.products'), width: 10 },
            // { name: this.t.pt('views.table.amount'), width: 10, sortable: false },
            { name: this.t.pt('views.table.request_date'), width: 20 },
            { name: this.t.pt('views.table.status'), width: 18 },
            // { name: this.t.pt('views.table.total'), width: 13 },
        ]

        this.orders.forEach((order) => {
            this.rows.push([
                { inner: this.getOrderCode(order), class: "order-id", title: true, click: () => this.goToDetail(order) },
                { inner: moment.utc(order.updatedDateTime).local().format('DD/MM/YYYY'), hideMobile: true },
                { inner: order.jobsite.jobsiteCode + " " + order.jobsite.jobsiteDesc, subtitle: true },
                { inner: order.purchaseOrder, hideMobile: true },
                { inner: "<i class='cmx-icon-track'></i>", hideMobile: true },
                // { inner: order.totalQuantity + " tons" },
                { inner: moment.utc(order.requestedDateTime).local().format('DD/MM/YYYY') },
                { inner: "<span class='status " + order.status.statusDesc.toLowerCase() + "'></span>" + order.status.statusDesc, hideMobile: false },
                // { inner: "$" + order.totalAmount, class: "roboto-bold" },
                // { inner: "<span class='status " + order.status.statusDesc.toLowerCase() + "'></span>" + order.status.statusDesc, hideDesktop: true },
            ]);
        });
    }

    initUsaCustomerOrders() {
        this.columns = [
            { name: this.t.pt('views.table.order_no'), width: 15 },
            { name: this.t.pt('views.table.submitted'), width: 15 },
            { name: this.t.pt('views.table.location'), width: 25 },
            { name: this.t.pt('views.table.pon'), width: 15 },
            { name: this.t.pt('views.table.products'), width: 10 },
            { name: this.t.pt('views.table.request_date'), width: 20 },
            { name: this.t.pt('views.table.status'), width: 18 },
        ]

        this.orders.forEach((order) => {
            this.rows.push([
                { inner: this.getOrderCode(order), class: "order-id", title: true, click: () => this.goToDetail(order) },
                { inner: moment.utc(order.createdDateTime).local().format('DD/MM/YYYY'), hideMobile: true },
                { inner: order.jobsite.jobsiteCode + " " + order.jobsite.jobsiteDesc, subtitle: true },
                { inner: order.purchaseOrder, hideMobile: true },
                { inner: "<i class='cmx-icon-track'></i>", hideMobile: true },
                { inner: moment.utc(order.requestedDateTime).local().format('DD/MM/YYYY') },
                { inner: "<span class='status " + order.status.statusCode.toLowerCase() + "'></span>" + order.status.statusDesc, hideMobile: false },
            ]);
        });
    }

    goToDetail(order) {
        this.router.navigate(['/ordersnproduct/app/order-detail'], {
            queryParams: {
                orderId: order.orderId ? order.orderId : null,
                orderCode: order.orderCode ? order.orderCode : null,
                businessLine: order.salesArea ? order.salesArea.businessLine.businessLineCode : null,
                country: order.salesArea.countryCode ? order.salesArea.countryCode : null
            }
        });
    }

    getOrderCode(order) {
        if (order.orderCode) { return order.orderCode; }
        if (order.orderId) { return order.orderId; }
    }

    pad(n, width, z?) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    orderResquestClicked() {
        // Set customer
        this.customer = this.customerService.currentCustomer();
        // Only for MX validate BD conexion
        if (this.customer.countryCode.trim() === 'MX') {
            this.dash.alertInfo(this.t.pt('views.common.validating_connection'), 0);
            this.ping.validatePingSalesOrder().subscribe((response) => {
                if (response.json().success === 'Y') {
                    this.router.navigate(['/ordersnproduct/app/new']);
                    this.dash.closeAlert();
                }
                else {
                    this.dash.alertError(this.t.pt('views.common.ping_unsuccessful'));
                }
            },
                error => {
                    this.dash.alertError(this.t.pt('views.common.ping_unsuccessful'));
                });
        }
        else {
            this.router.navigate(['/ordersnproduct/app/new']);
        }
    }
}

