import { Component, OnInit, Input } from '@angular/core';
import { OrderRequest } from '../../shared/models/order-request';
import { OrdersService } from '../../shared/services/orders.service';

import localForage = require("localforage");

@Component({
    selector: 'orders-table',
    templateUrl: './orders-table.html',
    styleUrls: ['./orders-table.scss', './orders-table.specific.scss']
})
export class OrdersTableComponent {
    @Input() orders: OrderRequest[];
    @Input() isLoading: boolean;

    private ORDERS_QTY_KEY = "ORDERS_QTY"

    ordersQty;

    constructor(private ordersService: OrdersService) {
        localForage.getItem(this.ORDERS_QTY_KEY).then(ordersQty => {
            this.ordersQty = ordersQty;
        });
    }

    ngOnChanges() {
        if (this.orders && this.orders.length > 0) {
            localForage.setItem(this.ORDERS_QTY_KEY, this.orders.length);
        }
    }

    changePage(page) { }

    favorite(orderRequestId, isFavorite) {
        this.ordersService.favoriteOrder(orderRequestId, isFavorite);
    }

    makeLocation(order): string {
        let requestItem = order.orderRequest.orderRequestItems[0];

        if (requestItem) {
            return requestItem.pointOfDelivery.address.postalCode + " " +
                requestItem.pointOfDelivery.address.streetName;
        }
        else { return ""; }
    }

}
