import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { PlantApi, ProductColorApi, ProductsApi, ShipmentLocationApi } from '../../shared/services/api';
import { CreateOrderService } from '../../shared/services/create-order.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from "../../shared/components/selectwithsearch/";
import { Plant, ProductColor, ProductWrapper } from '../../shared/types';
import { TranslationService } from '../../shared/services/translation.service';

@Component({
    selector: 'search-product',
    templateUrl: './search-product.html',
    styleUrls: ['./search-product.scss']
})

export class SearchProductComponent {
    @Output() canceled = new EventEmitter<any>();
    @Output() confirmed = new EventEmitter<any>();
    @ViewChild('confirmSelection') confirmSelection: ElementRef;
    private selectUndefinedOptionValue: any;

    private plants: Plant[] = [];
    private productColors: ProductColor[] = [];
    private products: ProductWrapper[] = [];
    private filteredProducts = []
    private selectedProduct = {};

    private productDescriptionInput = "";
    private productCodeInput = "";

    private productColorSelected = null;
    private plantSelected = null;

    constructor(private orderManager: CreateOrderService, private plantApi: PlantApi, private t: TranslationService,
        private productColorApi: ProductColorApi, private productsApi: ProductsApi, private shipmentLocationApi: ShipmentLocationApi) {
        this.orderManager._productColors.subscribe(response => {
            if (!response) {
                return;
            }
            
            this.productColors = response;
            this.modalInitialize();
            if (this.orderManager.jobsite && this.orderManager.shippingCondition && this.orderManager.shippingCondition.shippingConditionId == 2) {
                this.plantApi.byCountryCodeAndRegionCode(this.orderManager.jobsite.address.countryCode, this.orderManager.jobsite.address.regionCode).subscribe((response) => { this.plants = response.json().plants; });
            }
        })
    }

    productColorChanged(productColor: any) {
        this.setProducts([]);
        this.productsApi.byProductColorAndSalesDocumentAndPlant(3, productColor.productColorId).subscribe((response) => {
            this.setProducts(response.json().products);
        });
    }

    plantChanged(plant: any) {
        this.setProducts([]);
        this.productsApi.byProductColorAndSalesDocumentAndPlant(3, this.productColorSelected, plant).subscribe((response) => {
            this.setProducts(response.json().products);
        });
    }

    filterProductByProductDescription(event: any) {
        this.filteredProducts = this.products;
        this.productCodeInput = "";
        this.filteredProducts = this.filteredProducts.filter((product: any) => product.commercialDesc.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
    }

    filterProductByProductCode(event: any) {
        this.filteredProducts = this.products;
        this.productDescriptionInput = "";
        this.filteredProducts = this.filteredProducts.filter((product: any) => product.commercialCode.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
    }

    setSelectedProduct(product: any) {
        this.selectedProduct = product;
    }

    modalInitialize() {
        this.productColorSelected = null;
        this.plantSelected = null;
        this.setProducts([]);
        this.plants = [];
    }

    setProducts(products: any) {
        this.productDescriptionInput = "";
        this.productCodeInput = "";
        this.products = products;
        this.filteredProducts = products;
    }

    confirm() {
        this.orderManager._productSelectedProduct.next(this.selectedProduct);
        this.confirmed.emit();
    }

    cancel() {
        this.canceled.emit();
    }

    private timer: any;
    private preventSimpleClick = false;

    productSelected(product: any) {
        this.timer = 0;
        this.preventSimpleClick = false;
        let delay = 200;
        this.timer = setTimeout(() => {
            if (!this.preventSimpleClick) {
                this.setSelectedProduct(product);
            }
        }, delay);
    }

    productSelectedAndConfirm(product: any) {
        this.preventSimpleClick = true;
        clearTimeout(this.timer);
        this.setSelectedProduct(product);
        this.confirmSelection.nativeElement.click();
    }
}
