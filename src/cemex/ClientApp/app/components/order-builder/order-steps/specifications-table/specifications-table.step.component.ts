import { Component, OnInit, Input } from '@angular/core';
import { ETypeProduct, CementPackageSpecification } from '../../../../models/index'

@Component({
    selector: 'specifications-table',
    templateUrl: './specifications-table.html',
    styleUrls: ['./specifications-table.scss'],
    host: { 'class': 'w-100' }
})
export class SpecificationsTableStepComponent implements OnInit {

    @Input()
    typeProduct:ETypeProduct;

    _cementPackageList:CementPackageSpecification[] = [];

    constructor() { }

    ngOnInit() {
        if (!this.typeProduct) {
            this.typeProduct = ETypeProduct.CEMENT_PACKAGE;
            let dto:CementPackageSpecification = {
                productDescription:"Cement - SCAH - CHM89",
                quantity:10,
                unit: "tons",
                requestDate: "13/07/2017",
                requestTime: "15:00",
                productId: "20939302/10292/10102",
                maximumCapacity: 1000,
                contract: "10-201702189034     Remaining volume: 180",
                payment: "Credit",
                deliveryMode: "Delivery"
            };

            this._cementPackageList.push(dto);
        }
    }

}