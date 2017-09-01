import { Component, OnInit, Input } from '@angular/core';
import { OrdersApi } from '../../shared/services/api';

@Component({
    selector: 'order-detail-page',
    templateUrl: './order-detail.component.html',
    styleUrls: [
        './order-detail.component.scss',
        '../order-builder/order-steps/summary/summary.step.scss'
    ]
})
export class OrderDetailComponent {    
    constructor(private OrdersApi: OrdersApi) {
        OrdersApi.byId(41).subscribe((response) => {
            console.log(response);
        });
    }
}
