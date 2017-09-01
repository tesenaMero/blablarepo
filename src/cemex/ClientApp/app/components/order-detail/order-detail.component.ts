import { Component, OnInit, Input } from '@angular/core';
import { OrdersApiService } from '../../shared/services/orders-api.service';

@Component({
    selector: 'order-detail-page',
    templateUrl: './order-detail.component.html',
    styleUrls: [
        './order-detail.component.scss',
        '../order-builder/order-steps/summary/summary.step.scss'
    ]
})
export class OrderDetailComponent {    
    constructor(private ordersApi: OrdersApiService) {
        ordersApi.byId(41).subscribe((response) => {
            console.log(response);
        });
    }
}
