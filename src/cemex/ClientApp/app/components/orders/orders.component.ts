import { Component, OnInit } from '@angular/core';

import { OrdersApi } from '../../shared/api';
//import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'page-orders',
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss']
})
export class OrdersComponent implements OnInit {
  orders: any;
  isLoading: boolean;

  constructor(private ordersApi: OrdersApi) {
    this.isLoading = true;
    this.orders = ordersApi.all("4169").subscribe((response) => {
      this.orders = response.json().orders;
      this.isLoading = false;
    });
    //this.isLoading = ordersService.isLoading();
  }

  ngOnInit() {
    //this.ordersService.fetchAllOrders();
  }

}
