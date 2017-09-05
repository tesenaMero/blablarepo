import { Component, OnInit } from '@angular/core';

import { OrdersService } from '../../shared/services/orders.service';
import { Api } from '../../shared/services/api';
import { OrderRequestTableComponentConfiguration } from '../../utils/order-request.helper';

@Component({
  selector: 'page-orders',
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss']
})
export class OrdersComponent implements OnInit {
  orders: any;
  isLoading: any;

  public orderRequestConfiguration: OrderRequestTableComponentConfiguration;

  constructor(private ordersService: OrdersService, private Api: Api) {
    this.orders = ordersService.getOrders();
    this.isLoading = ordersService.isLoading();
    this.orderRequestConfiguration = OrdersService.ORDER_REQUEST_MAPPING;
  }

  ngOnInit() {
    this.ordersService.fetchAllOrders();
  }

}
