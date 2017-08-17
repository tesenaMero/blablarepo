import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'order-detail-page',
    templateUrl: './order-detail.component.html',
    styleUrls:  ['./order-detail.component.scss',
                 '../orders-table/orders-table.scss',
                 '../orders-table/orders-table.specific.scss'
                ]
})
export class OrderDetailComponent implements OnInit {
    order = 7543189;
    requestDate = "31/12/2017, 15:00 - 16:00";

    constructor() { }

    ngOnInit() {
    }
}
