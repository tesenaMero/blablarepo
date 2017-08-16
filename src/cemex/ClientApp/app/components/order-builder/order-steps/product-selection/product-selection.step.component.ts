import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'product-selection-step',
    templateUrl: './product-selection.html',
    styleUrls: ['./product-selection.scss'],
    host: {'class': 'w-100' }
})
export class ProductSelectionStepComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
