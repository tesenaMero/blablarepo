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

    ordersQty;

    columns = [
        { inner: '<i class="star cmx-icon-favourite-active" aria-hidden="true"></i>', width: 5 },
        { inner: "Order No", width: 10 },
        { inner: "Submitted", width: 15 },
        { inner: "Location", width: 20 },
        { inner: "Purchase Order Number", width: 20 },
        { inner: "Products", width: 10 },
        { inner: "Amount", width: 10 },
        { inner: "Requested date", width: 20 },
        { inner: "Status", width: 13 },
        { inner: "otal amount", width: 13 },
        { inner: "", width: 5 },
    ]

    constructor(private OrdersService: OrdersService) {
        localForage.getItem('ordersQty').then(ordersQty => {
            this.ordersQty = ordersQty;
        });
    }

    ngOnChanges() {
        if (this.orders && this.orders.length > 0) {
            localForage.setItem('ordersQty', this.orders.length);
        }
    }

    changePage(page) {
    }

    favorite(orderRequestId, isFavorite) {
        this.OrdersService.favoriteOrder(orderRequestId, isFavorite);
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
