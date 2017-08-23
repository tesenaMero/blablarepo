import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'loading-table',
    templateUrl: './loading-table.html',
    styleUrls: ['./loading-table.scss']
})
export class LoadingTableComponent {
    @Input() rows: number = 2;
    
    range = [];
    columns = [
        { inner: '<i class="star cmx-icon-favourite-active" aria-hidden="true"></i>', width: 5 },
        { inner: "Order No", width: 10 },
        { inner: "Submitted", width: 15},
        { inner: "Location", width: 20},
        { inner: "Purchase Order Number", width: 20},
        { inner: "Products", width: 10},
        { inner: "Amount", width: 10},
        { inner: "Requested date", width: 20},
        { inner: "Status", width: 13},
        { inner: "otal amount", width: 13},
        { inner: "", width: 5},
    ]

    constructor() {}

    ngOnChanges() {
        this.range = Array(this.rows);
    }

    isOdd(n: number): boolean {
        return (n & 1) == 1;
    }
}
