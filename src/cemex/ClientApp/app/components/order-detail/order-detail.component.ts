import { Component, OnInit, Input } from '@angular/core';
import { OrderDetailApi } from '../../shared/services/api/order-detail.service';
import { ActivatedRoute } from '@angular/router';

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
    id: number;
    type: string = "SLS";
    private sub: any;

    constructor(private orderDetailApi: OrderDetailApi, private route: ActivatedRoute) {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['orderId'];
            if (params['typeCode'] && params['typeCode'] == "ZTA") {
                this.type = "SLS";
            } 
            else {
                if (params['typeCode']) {
                    this.type = params['typeCode'];
                }
            }
        });
        
        orderDetailApi.byIdType(this.id, this.type).subscribe((response) => {
            this.orderDetailData = response.json();
        });        
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }        
}
