import { Component, OnInit, Input } from '@angular/core';
import { OrderDetailApi } from '../../shared/api/order-detail';

@Component({
    selector: 'order-detail-page',
    templateUrl: './order-detail.component.html',
    styleUrls: [
        './order-detail.component.scss',
        '../order-builder/order-steps/summary/summary.step.scss'
    ]
})
export class OrderDetailComponent {   
    orderDetailData: any;

    constructor(private orderDetailApi: OrderDetailApi) {
        orderDetailApi.byId(1).subscribe((response) => {
            console.log(response);
            this.orderDetailData = response;
        });
    }
}
