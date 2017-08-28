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
    @Input() show: boolean = false;

    order = 7543189;
    requestDate = "31/12/2017, 15:00 - 16:00";

    constructor() { }

    changeTabComments() {
        document.getElementById("products").classList.remove('active');
        document.getElementById("comments").classList.add('active');
        this.show = true;
    }

    changeTabProducts() {
        document.getElementById("comments").classList.remove('active');
        document.getElementById("products").classList.add('active');
        this.show = false;
    }

}
