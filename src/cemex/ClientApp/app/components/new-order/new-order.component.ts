import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';
import { CreateOrderService } from '../../shared/services/create-order.service';

@Component({
    selector: 'new-order',
    templateUrl: './new-order.html',
    styleUrls: ['./new-order.scss']
})
export class NewOrderComponent implements OnInit, OnDestroy {
    constructor(public createOrder: CreateOrderService, private t: TranslationService) { }
    ngOnInit() { }
    ngOnDestroy() {
        this.createOrder.resetOrder();
    }
}
