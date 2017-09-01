import { Component, OnInit, Input } from '@angular/core';
import { ETypeProduct, CementPackageSpecification, ReadymixSpecification } from '../../../../../../models'

@Component({
    selector: 'specifications-table',
    templateUrl: './specifications-table.html',
    styleUrls: ['./specifications-table.scss'],
    host: { 'class': 'w-100' }
})
export class SpecificationsTableStepComponent implements OnInit {
    @Input() typeProduct:ETypeProduct;
    
    _cementPackageList:CementPackageSpecification[] = [];
    _readymix:ReadymixSpecification[] = [];
    isMx: boolean;
    isUs: boolean;
    constructor() { }

    ngOnInit() {
        this.isMx = true;
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
                contract: "10-201702189034 Remaining volume: 180",
                payment: "Credit",
                deliveryMode: "Delivery",
                unitaryPrice: 1000
            };

            this._cementPackageList.push(dto);
        }

        // if (!this.typeProduct) {
        //     this.typeProduct = ETypeProduct.READY_MIX;
        //     let dto:ReadymixSpecification = {
        //         productDescription:"RMX - SCAH - CHM89",
        //         quantity:7,
        //         unit: "m3",
        //         requestDate: "13/07/2017",
        //         requestTime: "15:00",
        //         productId: "20939302/10292/10102",
        //         maximumCapacity: 1000,
        //         contract: "10-201702189034 Remaining volume: 180",
        //         payment: "Credit",
        //         deliveryMode: "Delivery",
        //         projectProfile: {
        //             id: 1,
        //             name: 'Hotel',
        //             aplication: 'Base',
        //             loadSize: '20 m3',
        //             spacing: '10 min',
        //             slump: '',
        //         },
        //     };

        //     this._readymix.push(dto);
        // }
    }

}