import { Component, OnInit, PipeTransform, Pipe, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ETypeProduct, CementPackageSpecification, CartProductGroup, ReadymixSpecification } from '../../models/index';
import { WindowRef } from '../../shared/services/window-ref.service';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
    selector: 'cart-page',
    templateUrl: './cart.html',
    styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {

    _productGroups: CartProductGroup[] = [];
    _productsReadymix: ReadymixSpecification[] = [];
    _products: any[] = [];
    disableCartBtn: boolean;
    constructor(private location: Location, private windowRef: WindowRef, @Inject(DOCUMENT) private document: any) { }

    ngOnInit() {
        this.disableCartBtn = false;
        let dummyProductGpo: CartProductGroup[] = [
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
        ];

        let dummyProducts: ReadymixSpecification[] = [
            {
                productDescription: "ReadyMix CHM89",
                quantity: 2,
                unit: "tons",
                requestDate: "13/07/2017",
                requestTime: "15.00 - 16.00",
                location: "Southwest 68th Street building",
                productId: "20939302/10292/20102",
                contract: "10-201702189034    Remaining volume: 180",
                pointDelivery: "Backstreet yard",
                projectProfile: {
                    id: 1,
                    aplication: "Roof",
                    name: "My Project Profile with quite long technical title, that it must be for more rows",
                    loadSize: "10 tons",
                    slump: "",
                    spacing: "10 min"
                },

                dischargeTime: "60 min",
                transportMethod: "Truck",
                unloadType: "Pump",
                pumpCapacityMax: "40 m3/s",
                pumpCapacityMin: "30 m3/s",
                loadSize: "10 tons",
                spacing: "10 mins",
                deliveryMode: "Delivery",
                kicker: true,
                unitaryPrice: 2500
            }
        ];

        this._productsReadymix = dummyProducts;
        //this._productGroups = dummyProductGpo;

        this._products = this._productGroups.length ? this._productGroups : this._productsReadymix;
    }

    back() {
        this.location.back();
    }

    placeOrder() {
        const mock = {
            "sourceApp": "order-taking",
            "date": "2017-08-30T21:29:06.627Z",
            "screenToShow": "cash-sales",
            "data": [
                {
                    "companyCode": "7180",
                    "customerCode": "0050163248",
                    "jobSiteCode": "0065014102",
                    "payerCode": "0065014102",
                    "orderAmount": 500,
                    "paymentReference": "",
                    "documents": [
                    ]
                }
            ]
        };
        this.disableCartBtn = true;
        let encoded = this.windowRef.btoa(JSON.stringify(mock)).replace(/=/g,'-');
        this.document.location.href = 'http://quotation-pricing-ac.mybluemix.net/product-name/open/'+ encoded;
    }
}