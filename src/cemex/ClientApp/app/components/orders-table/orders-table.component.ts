import { Component, OnInit, Input } from '@angular/core';
import { OrderRequest } from '../../shared/models/order-request';
import { NoSpacePipe } from '../../pipes/nospace.pipe'

@Component({
    selector: 'orders-table',
    templateUrl: './orders-table.html',
    styleUrls: ['./orders-table.scss', './orders-table.specific.scss']
})
export class OrdersTableComponent implements OnInit {
    @Input() orders: OrderRequest;
    @Input() isLoading: boolean;

    constructor() { }

    ngOnInit() {
    }

    changePage(page) {
    }

    isOdd(n: number): boolean {
        return (n & 1) == 1;
    }

}
