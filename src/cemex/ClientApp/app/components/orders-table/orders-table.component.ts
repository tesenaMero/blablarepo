import { Component, OnInit, Input } from '@angular/core';
import { OrderRequest } from '../../shared/models/order-request';
import { OrdersService } from '../../shared/services/orders.service';
import {
    OrderRequestHelper,
    OrderRequestTableComponentConfiguration,
    OrderRequestLayoutConfiguration,
    OrderBusinessLines
} from '../../utils/order-request.helper';

import localForage = require('localforage');

@Component({
    selector: 'orders-table',
    templateUrl: './orders-table.html',
    styleUrls: ['./orders-table.scss', './orders-table.specific.scss']
})
export class OrdersTableComponent {
    public compoundConfig = { columns: [] };
    ordersQty: any;
    sortOrder: Object = {};
    sortedBy: any;

    @Input() orders: OrderRequest[];
    @Input() isLoading: boolean;
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

    private ORDERS_QTY_KEY = "ORDERS_QTY";

    constructor(private ordersService: OrdersService) {
        localForage.getItem(this.ORDERS_QTY_KEY).then(ordersQty => {
            this.ordersQty = ordersQty;
        });
    }

    public tableConfiguration: OrderRequestLayoutConfiguration = {
        columns: [
            {
                key: 'orderId',
                hidden: true
            },
            {
                key: 'orderRequestId',
                title: 'Order No',
                width: 8,
                sortable: true
            },
            {
                key: 'submitedOn',
                title: 'Submitted',
                width: 10,
                sortable: true
            },
            {
                key: 'pointOfDelivery',
                title: 'Location',
                width: 18,
                sortable: true
            },
            {
                key: 'purchaseOrder',
                title: 'Purchase Order Number',
                width: 10,
                sortable: true
            },
            {
                key: 'businessLine',
                title: 'Products',
                width: 8,
                sortable: true
            },
            {
                key: 'amount',
                title: 'Amount',
                width: 10,
                sortable: false
            },
            {
                key: 'requestedOn',
                title: 'Requested date',
                width: 16,
                sortable: true
            },
            {
                key: 'status',
                title: 'Status',
                width: 10,
                sortable: true
            },
            {
                key: 'statusCode',
                hidden: true,
            },
            {
                key: 'total',
                title: 'Total amount',
                width: 10,
                sortable: true
            },
            {
                key: 'totalFilter',
                hidden: true,
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
            },
            {
                key: 'unitDesc',
                hidden: true,
            }
        ]
    };

    get filteredColumns() {
        return this.compoundConfig.columns.filter(c => !c.hidden);
    }

    ngOnInit() {
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

    onRowClick(order: OrderRequest) {
        console.log(this.orders);
    }

    showIcon(businessLineCode: string) {
        return OrderBusinessLines[businessLineCode] >= 0 ? true : false
    }

    sortBy(column, asc) {
        if(column.sortable) {
            this.ordersService.orderBy({ asc: Boolean(asc), key: column.key });
            this.sortedBy = column.key;
            this.sortOrder[column.key] = !this.sortOrder[column.key];
        }
    }

}
