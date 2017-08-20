import { Component, OnInit, Input } from '@angular/core';
import { OrderRequest } from '../../shared/models/order-request';
import { OrdersService } from '../../shared/services/orders.service';

@Component({
    selector: 'orders-table',
    templateUrl: './orders-table.html',
    styleUrls: ['./orders-table.scss', './orders-table.specific.scss']
})
export class OrdersTableComponent implements OnInit {
    @Input() orders: OrderRequest;
    @Input() isLoading: boolean;

    columns = [
        { inner: '<i class="star cmx-icon-favourite-active" aria-hidden="true"></i>', width: 5 },
        { inner: "Order No", width: 10 },
        { inner: "Submitted", width: 15},
        { inner: "Location", width: 20},
        { inner: "Purchase Order Number", width: 20},
        { inner: "Products", width: 10},
        { inner: "Amount", width: 10},
        { inner: "Requested date", width: 20},
        { inner: "Status", width: 13},
        { inner: "otal amount", width: 13},
        { inner: "", width: 5},
    ]

    constructor(private OrdersService: OrdersService) { }

    ngOnInit() {
    }

    changePage(page) {
    }

    isOdd(n: number): boolean {
        return (n & 1) == 1;
    }

    pad(text: any, size: number): string {
        var s = text + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    favorite(orderRequestId, isFavorite) {
        this.OrdersService.favoriteOrder(orderRequestId, isFavorite);
    }

    makeLocation(order): string {
        let requestItem = order.orderRequest.orderRequestItems[0];

        if (requestItem) {
            return  requestItem.pointOfDelivery.address.postalCode + " " +
            requestItem.pointOfDelivery.address.streetName;
        }
        else { return ""; }
    }

}
