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
    private sub: any;

    constructor(private orderDetailApi: OrderDetailApi, private route: ActivatedRoute) {
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            //console.log(this.id);
        });
        // orderDetailApi.byId(1).subscribe((response) => {
        orderDetailApi.byId(this.id).subscribe((response) => {            
            console.log(response);
            this.orderDetailData = response.json();
        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }        
}
