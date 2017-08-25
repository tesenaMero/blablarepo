import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ETypeProduct, CementPackageSpecification } from '../../models/index';

interface CartProductGroup {
    id: number;
    products: CementPackageSpecification[];
}

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
                        unitaryPrice : 2000
                    }
                ]
            }
        ]
    }

    back() {
        this.location.back();
    }
}