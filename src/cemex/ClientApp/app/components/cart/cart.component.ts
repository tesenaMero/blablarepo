import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
import { Location } from '@angular/common';
import { ETypeProduct, CementPackageSpecification, CartProductGroup } from '../../models/index';

@Component({
    selector: 'cart-page',
    templateUrl: './cart.html',
    styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {

    _productGroups: CartProductGroup[];
    constructor(private location: Location) { }

    ngOnInit() {
        this._productGroups = [
            {
                id: 1,
                products: [
                    {
                        contract: "10-201702189034 Remaining volume: 180",
                        deliveryMode: "Delivery",
                        location: "Southwest 68th Street building",
                        maximumCapacity: 10,
                        payment: "Credit",
                        productDescription: "Cement",
                        productId: "20939302/10292/10102",
                        quantity: 10,
                        requestDate: "13/07/2017",
                        requestTime: "15:00 - 16:00",
                        unit: "tons",
                        unitaryPrice: 2000,
                        pointDelivery: "Backstreet yard"
                    },
                    {
                        contract: "10-201702189034 Remaining volume: 180",
                        deliveryMode: "Delivery",
                        location: "Southwest 68th Street building",
                        maximumCapacity: 10,
                        payment: "Credit",
                        productDescription: "Cement",
                        productId: "20939302/10292/10102",
                        quantity: 2,
                        requestDate: "13/07/2017",
                        requestTime: "15:00 - 16:00",
                        unit: "tons",
                        unitaryPrice: 2500,
                        pointDelivery: "Backstreet yard"
                    }
                ]
            },
            {
                id: 2,
                products: [
                    {
                        contract: "10-201702189034 Remaining volume: 180",
                        deliveryMode: "Delivery",
                        location: "Southwest 68th Street building",
                        maximumCapacity: 10,
                        payment: "Credit",
                        productDescription: "Cement",
                        productId: "20939302/10292/10102",
                        quantity: 10,
                        requestDate: "13/07/2017",
                        requestTime: "15:00 - 16:00",
                        unit: "tons",
                        unitaryPrice: 2500,
                        pointDelivery: "Backstreet yard"
                    }
                ]
            }
        ]
    }

    back() {
        this.location.back();
    }
}