import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../shared/services/orders.service';
import { PingSalesOrderApi } from '../../shared/services/api/ping-sales-order.service';
import { OrderRequestTableComponentConfiguration } from '../../utils/order-request.helper';
import { DashboardService } from '../../shared/services/dashboard.service';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';
import { Router } from '@angular/router';
import { CustomerService } from '../../shared/services/customer.service';
import { OrdersApi } from '../../shared/services/api/orders.service';
import * as moment from 'moment'

@Component({
    selector: 'page-orders',
    templateUrl: './orders.html',
    styleUrls: ['./orders.scss']
})
export class OrdersComponent implements OnInit {
    orders: any;

    isLoading: any;
    totalPages: any;
    customer: any;

    columns: any[] = [];
    rows: any[] = [];

    public orderRequestConfiguration: OrderRequestTableComponentConfiguration;

    constructor(private ordersService: OrdersService, private t: TranslationService, private ping: PingSalesOrderApi, private dash: DashboardService, private router: Router, private customerService: CustomerService, private ordersApi: OrdersApi) {
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
                
                this.initOrders();
            }
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
        });
    }

    ngOnInit() { }

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
            this.rows.push([
                { inner: this.getOrderCode(order), class: "order-id", title: true, click: () => this.goToDetail(order) },
                { inner: moment.utc(order.updatedDateTime).local().format('DD/MM/YYYY'), hideMobile: true },
                { inner: order.jobsite.jobsiteCode + " " + order.jobsite.jobsiteDesc, subtitle: true },
                { inner: order.purchaseOrder, hideMobile: true },
                { inner: "<i class='cmx-icon-track'></i>", hideMobile: true },
                { inner: order.totalQuantity + " tons" },
                { inner: moment.utc(order.requestedDateTime).local().format('DD/MM/YYYY') },
                { inner: "<span class='status " + order.status.statusDesc.toLowerCase() + "'></span>" + order.status.statusDesc, hideMobile: false },
                { inner: "$" + order.totalAmount, class: "roboto-bold" },
                // { inner: "<span class='status " + order.status.statusDesc.toLowerCase() + "'></span>" + order.status.statusDesc, hideDesktop: true },
            ]);
        });
    }

    goToDetail(order) {
        this.router.navigate(['/ordersnproduct/app/order-detail'], {
            queryParams: {
                orderId: order.orderId ? order.orderId : null,
                typeCode: order.orderType ? order.orderType.orderTypeCode : null,
                orderCode: order.orderCode ? order.orderCode : null,
                businessLine: order.orderCode ? order.salesArea.businessLine.businessLineCode : null
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

