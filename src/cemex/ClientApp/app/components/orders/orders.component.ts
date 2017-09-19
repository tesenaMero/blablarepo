import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../shared/services/orders.service';
import { Api } from '../../shared/services/api';
import { PingSalesOrderApi } from '../../shared/services/api/ping-sales-order.service';
import { OrderRequestTableComponentConfiguration } from '../../utils/order-request.helper';
import { DashboardService } from '../../shared/services/dashboard.service';
import { TranslationService } from '../../shared/services/translation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'page-orders',
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss']
})
export class OrdersComponent implements OnInit {
  orders: any;
  isLoading: any;
  totalPages: any;

  public orderRequestConfiguration: OrderRequestTableComponentConfiguration;

  constructor(private ordersService: OrdersService, private Api: Api, private t: TranslationService, private ping: PingSalesOrderApi, private dash: DashboardService, private router: Router) {
    this.orders = ordersService.getOrders();
    this.isLoading = ordersService.isLoading();
    this.orderRequestConfiguration = OrdersService.ORDER_REQUEST_MAPPING;
    this.totalPages = ordersService.getTotalPages();
  }

  ngOnInit() {
    this.ordersService.fetchAllOrders();
  }

  orderResquestClicked() {
    this.dash.alertInfo(this.t.pt('views.common.validating_connection'), 99999);
    this.ping.validatePingSalesOrder().subscribe((response) => {
      if (response.json().success === 'Y') {
        this.router.navigate(['/app/new']);
        this.dash.closeAlert();
      }
      else {
        this.dash.alertError(this.t.pt('views.common.ping_unsuccessful'));
      }
    });
  }

}
