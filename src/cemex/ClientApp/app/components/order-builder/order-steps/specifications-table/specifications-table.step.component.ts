import { Component, OnInit, Input } from '@angular/core';
import { ETypeProduct } from '../../../../models/index'

@Component({
    selector: 'specifications-table',
    templateUrl: './specifications-table.html',
    styleUrls: ['./specifications-table.scss'],
    host: { 'class': 'w-100' }
})
export class SpecificationsTableStepComponent implements OnInit {

    @Input()
    typeProduct:ETypeProduct;

    constructor() { }

    ngOnInit() {
        if (!this.typeProduct) {
            this.typeProduct = ETypeProduct.CEMENT_PACKAGE;
        }
    }

}