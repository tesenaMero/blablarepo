import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';
import { OrdersService } from '../../shared/services/orders.service';
import { PingSalesOrderApi } from '../../shared/services/api/ping-sales-order.service';
import { OrderRequestTableComponentConfiguration } from '../../utils/order-request.helper';
import { DashboardService } from '../../shared/services/dashboard.service';
import { CustomerService } from '../../shared/services/customer.service';
import { OrdersApi } from '../../shared/services/api/orders.service';
import { EncodeDecodeJsonObjService } from '../../shared/services/encodeDecodeJsonObj.service';
import { Subscription } from 'rxjs/Subscription'

import { getOrderType, buisnessLIneCodes } from '../../shared/models/order-request';
import * as moment from 'moment'

@Component({
    selector: 'page-orders',
    templateUrl: './orders.html',
    styleUrls: ['./orders.scss']
})
export class OrdersComponent implements OnDestroy {
    // Table
    isLoading: any;
    lock: boolean = false;

    orders: any = [];
    columns: any[] = [];
    rows: any[] = [];
    totalPages: any;

    // Lang
    countryCode: string;
    language: string;

    // Subs
    sub: Subscription;

    public orderRequestConfiguration: OrderRequestTableComponentConfiguration;

    constructor(
        private ordersService: OrdersService,
        private t: TranslationService,
        private ping: PingSalesOrderApi,
        private dash: DashboardService,
        private router: Router,
        private customerService: CustomerService,
        private ordersApi: OrdersApi,
        private encDecJsonObjService: EncodeDecodeJsonObjService) {

        this.isLoading = true;

        // Listen to customer change
        this.customerService.customerSubject.subscribe((customer) => {
            if (customer) {
                this.countryCode = customer.countryCode.trim() || "US";
                this.fetchOrders();
            }
        });

        // Listen to language change
        this.sub = this.t.localeData.subscribe(response => {
            // If its different from the already selected language
            if (this.language != response.lang) {
                this.language = response.lang;
                this.fetchOrders();
            }
        });
    }

    initOrders(orders: any[]) {
        // Filter drafts
        this.cleanArray(this.orders);
        this.setOrders(orders);

        if (this.countryCode && this.countryCode === "US") {
            this.fillUsaCustomerOrders();
        }
        else {
            this.fillOrders();
        }
    }

    cleanArray(arr: any[]) {
        arr.splice(0, arr.length);
    }

    setOrders(orders: any[]) {
        this.orders = orders.filter((item) => {
            if (item.status && item.status.statusDesc) {
                return item.status.statusCode != "DRFT";
            }
            return true;
        });
    }

    fetchOrders() {
        if (this.lock) { return; }

        this.lock = true;
        this.ordersApi.all().subscribe((response) => {
            if (response.status == 200) {
                let orders: any[] = response.json().orders;
                this.initOrders(orders);
            }

            this.isLoading = false;
            this.lock = false;
        }, error => {
            this.isLoading = false;
            this.lock = false;
        });
    }

    getOrderIcon(order) {
        const orderType = getOrderType(order);

        switch (orderType) {
            case buisnessLIneCodes.rmx:
                return '<i class="cmx-icon-ready-mix"></i>';
            case buisnessLIneCodes.cem:
                return '<i class="cmx-icon-bag-cement"></i>';
            case buisnessLIneCodes.aggr:
                return '<i class="cmx-icon-aggregates"></i>';
            default:
                return '';
        }
    }

    fillOrders() {
        this.cleanArray(this.columns);
        this.cleanArray(this.rows);
        this.isLoading = true;
        
        // Fill columns 
        this.columns = [
            //{ inner: '<i class="star cmx-icon-favourite-active" aria-hidden="true"></i>', width: 5 },
            { name: this.t.pt('views.table.order_no'), width: 15 },
            { name: this.t.pt('views.table.submitted'), width: 15 },
            { name: this.t.pt('views.table.location'), width: 25 },
            { name: this.t.pt('views.table.pon'), width: 15 },
            { name: this.t.pt('views.table.products'), width: 10 },
            // { name: this.t.pt('views.table.amount'), width: 10, sortable: false },
            // { name: this.t.pt('views.table.request_date'), width: 20 },
            { name: this.t.pt('views.table.status'), width: 18 },
            // { name: this.t.pt('views.table.total'), width: 13 },
        ]

        // Fill rows
        this.orders.forEach((order) => {
            this.rows.push([
                { inner: this.getOrderCode(order), class: "order-id", title: true, click: () => this.goToDetail(order) },
                { inner: this.dateFormat(order.updatedDateTime), hideMobile: true },
                { inner: order.jobsite.jobsiteCode + " " + order.jobsite.jobsiteDesc, subtitle: true },
                { inner: order.purchaseOrder, hideMobile: true },
                { inner: this.getOrderIcon(order), hideMobile: true },
                { inner: "<span class='status " + order.status.statusCode.toLowerCase() + "'></span>" + order.status.statusDesc, hideMobile: false },
            ]);
        });
    }

    fillUsaCustomerOrders() {
        this.cleanArray(this.columns);
        this.cleanArray(this.rows);
        this.isLoading = true;

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
                { inner: this.dateFormat(order.updatedDateTime), hideMobile: true },
                { inner: order.jobsite.jobsiteCode + " " + order.jobsite.jobsiteDesc, subtitle: true },
                { inner: order.purchaseOrder, hideMobile: true },
                { inner: this.getOrderIcon(order), hideMobile: true },
                { inner: this.dateFormat(order.requestedDateTime) },
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

    dateFormat(time) {
        if (this.countryCode === "MX") {
            return moment.utc(time).local().format('DD/MM/YYYY')
        } else {
            return moment.utc(time).local().format('MM/DD/YYYY')
        }
    }

    orderResquestClicked() {
        // Set customer
        const customer = this.customerService.currentCustomer();
        // Only for MX validate BD conexion
        if (customer.countryCode.trim() === 'MX') {
            this.dash.alertTranslateInfo('views.common.validating_connection', 0);
            this.ping.validatePingSalesOrder().subscribe((response) => {
                if (response.json().success === 'Y') {
                    this.router.navigate(['/ordersnproduct/app/new']);
                    this.dash.closeAlert();
                }
                else {
                    this.dash.alertTranslateError('views.common.ping_unsuccessful');
                }
            },
            error => {
                this.dash.alertTranslateError('views.common.ping_unsuccessful');
            });
        }
        else {
            this.router.navigate(['/ordersnproduct/app/new']);
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}

