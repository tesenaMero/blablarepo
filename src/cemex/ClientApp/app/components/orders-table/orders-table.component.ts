import { Component, OnInit, Input } from '@angular/core';
import { OrderRequest } from '../../shared/models/order-request';
import { OrdersService } from '../../shared/services/orders.service';
import {
    OrderRequestHelper,
    OrderRequestTableComponentConfiguration,
    OrderRequestLayoutConfiguration 
} from '../../utils/order-request.helper';

import localForage = require('localforage');

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

    sortOrder: Object = {};
    sortedBy: any;

    // columns = [
    //     { inner: "Order No", width: 10, key: 'orderRequestId' },
    //     { inner: "Submitted", width: 15, key: 'viewedAt' },
    //     { inner: "Location", width: 20, key: 'pointOfDelivery' },
    //     { inner: "Purchase Order Number", width: 20, key: 'purchaseOrder' },
    //     { inner: "Products", width: 10, key: 'productLine' },
    //     { inner: "Amount", width: 10, key: 'amount' },
    //     { inner: "Requested date", width: 20, key: 'requestedOn' },
    //     { inner: "Status", width: 13, key: 'status' },
    //     { inner: "Total amount", width: 13, key: 'total' },
    // ]

    public tableConfiguration: OrderRequestLayoutConfiguration = {
        columns: [
            {
                key: 'orderRequestId',
                title: 'Order No',
                width: 14
            },
            {
                key: 'submitedOn',
                title: 'Submitted',
                width: 18
            },
            {
                key: 'pointOfDelivery',
                title: 'Location',
                width: 12
            },
            {
                key: 'purchaseOrder',
                title: 'Purchase Order Number',
                width: 8
            },
            {
                key: 'businessLine',
                title: 'Products',
                width: 8
            },
            {
                key: 'amount',
                title: 'Amount',
                width: 10
            },
            {
                key: 'requestedOn',
                title: 'Requested date',
                width: 14
            },
            {
                key: 'Status',
                title: 'status',
                width: 10
            },
            {
                key: 'total',
                title: 'Total amount',
                width: 10
            },
            {
                key: 'submittedOn',
                hidden: true,
            },
            {
                key: 'submittedBy',
                hidden: true,
            },
            {
                key: 'contractCode',
                hidden: true,
            },
            {
                key: 'poNumber',
                hidden: true,
            },
            {
                key: 'requestedOnFiltered',
                hidden: true,
            },
            {
                key: 'submitedOnFiltered',
                hidden: true,
            }
        ]
    };

    public compoundConfig = { columns: [] };

    @Input() set configuration(value: OrderRequestTableComponentConfiguration) {
        this.compoundConfig.columns.length = 0;
        value.columns.forEach((col) => {
            let i = 0;
            while (i < this.tableConfiguration.columns.length && this.tableConfiguration.columns[i].key !== col.key) {
                i++;
            };
            const compoundItem = Object.assign(col, this.tableConfiguration.columns[i]);
            this.compoundConfig.columns.push(compoundItem);
        });
    };

    ngOnInit() {
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

    sortBy(key, asc) {
        this.OrdersService.orderBy({ asc: Boolean(asc), key: key });
        this.sortedBy = key;
        this.sortOrder[key] = !this.sortOrder[key];

    }

}
