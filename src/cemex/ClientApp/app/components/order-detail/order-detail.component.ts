import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'order-detail-page',
    templateUrl: './order-detail.component.html',
    styleUrls: [
        './order-detail.component.scss',
        '../order-builder/order-steps/summary/summary.step.scss'
    ]
})
export class OrderDetailComponent {
    order = 7543189;
    requestDate = "31/12/2017, 15:00 - 16:00";
    
    constructor() { }
}
