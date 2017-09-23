import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../shared/services/orders.service';
import { Api } from '../../shared/services/api';
import { PingSalesOrderApi } from '../../shared/services/api/ping-sales-order.service';
import { OrderRequestTableComponentConfiguration } from '../../utils/order-request.helper';
import { DashboardService } from '../../shared/services/dashboard.service';
import { TranslationService } from '../../shared/services/translation.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../shared/services/customer.service'

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

    public orderRequestConfiguration: OrderRequestTableComponentConfiguration;

    constructor(private ordersService: OrdersService, private Api: Api, private t: TranslationService, private ping: PingSalesOrderApi, private dash: DashboardService, private router: Router, private customerService: CustomerService) {
        this.orders = ordersService.getOrders();
        this.isLoading = ordersService.isLoading();
        this.orderRequestConfiguration = OrdersService.ORDER_REQUEST_MAPPING;
        this.totalPages = ordersService.getTotalPages();
    }

    ngOnInit() {
        this.ordersService.fetchAllOrders();
    }

    orderResquestClicked() {
        // Set customer
        this.customer = this.customerService.currentCustomer();
        // Only for MX validate BD conexion
        if (this.customer.countryCode.trim() === 'MX') {
            this.dash.alertInfo(this.t.pt('views.common.validating_connection'), 0);
            this.ping.validatePingSalesOrder().subscribe((response) => {
                if (response.json().success === 'Y') {
                    this.router.navigate(['/app/new']);
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
            this.router.navigate(['/app/new']);
        }
    }
}

