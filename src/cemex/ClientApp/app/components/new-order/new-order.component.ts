import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { CreateOrderService } from '../../shared/services/create-order.service';

@Component({
    selector: 'new-order',
    templateUrl: './new-order.html',
    styleUrls: ['./new-order.scss']
})
export class NewOrderComponent implements OnInit, OnDestroy {
    constructor(public createOrder: CreateOrderService) { }
    ngOnInit() { }
    ngOnDestroy() {
        this.createOrder.resetOrder();
    }
}
