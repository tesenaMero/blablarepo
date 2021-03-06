import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { PlantApi, ProductColorApi, ProductsApi, ShipmentLocationApi, SalesDocumentApi } from '../../shared/services/api';
import { CreateOrderService } from '../../shared/services/create-order.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from "../../shared/components/selectwithsearch/";
import { Plant, ProductColor, ProductWrapper } from '../../shared/types';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';
import { SearchProductService } from '../../shared/services/product-search.service';
import { CustomerService } from '../../shared/services/customer.service';
import { Validations } from '../../utils/validations';

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
    private selectedProduct: any;

    private productDescriptionInput = "";
    private productCodeInput = "";

    private productColorSelected = null;
    private plantSelected = null;


    private message: boolean = false;

    private PRODUCT_LINES = {
        Readymix: 6,
        CementBulk: 1
    }

    private UTILS = Validations;

    constructor(
        private t: TranslationService,
        private orderManager: CreateOrderService, 
        private plantApi: PlantApi, 
        private productColorApi: ProductColorApi, 
        private productsApi: ProductsApi, 
        private shipmentLocationApi: ShipmentLocationApi, 
        private searchProductService: SearchProductService,
        private customerService: CustomerService,
        private salesDocumentService: SalesDocumentApi) {
        this.searchProductService.productColors.subscribe(response => {
            if (!response) { return; }
            
            this.productColors = response;
            this.modalInitialize();
            if (Validations.isPickup() && Validations.isMexicoCustomer() && Validations.isBulkCement()) {
                this.plantApi.forSearch(
                    this.orderManager.jobsite.address.countryCode,
                    this.orderManager.jobsite.address.regionCode,
                    this.orderManager.productLine.productLineId,
                    this.orderManager.jobsite.shipmentLocationId
                ).subscribe((response) => { this.plants = response.json().plants; });
            }
        })
    }

    productColorChanged(productColor: any) {
        this.message = false;
        this.setProducts([]);
        const salesDocumentId = this.salesDocumentService.getDocument("R").salesDocumentTypeId;
        this.productsApi.byProductColorAndSalesDocumentAndPlant(this.orderManager.jobsite.shipmentLocationId, salesDocumentId, this.productColorSelected, this.orderManager.productLine.productLineId).subscribe((response) => {
            this.setProducts(response.json().products);
        });
    }

    plantChanged(plant: any) {
        this.setProducts([]);
        if (this.productColorSelected !== null) {
            const salesDocumentId = this.salesDocumentService.getDocument("R").salesDocumentTypeId;
            this.productsApi.byProductColorAndSalesDocumentAndPlant(this.orderManager.jobsite.shipmentLocationId, salesDocumentId, this.productColorSelected, this.orderManager.productLine.productLineId, plant).subscribe((response) => {
                this.setProducts(response.json().products);
            });
        }
        else {
            this.message = true;
        }

    }

    filterProductByProductDescription(event) {
        this.filteredProducts = this.products;
        this.productCodeInput = "";
        this.filteredProducts = this.filteredProducts.filter((item) => {
            if (item.commercialDesc) { 
                return item.commercialDesc.toLowerCase().indexOf(event.toLowerCase()) > -1;
            }
        });
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
        this.message = false;
    }

    setProducts(products: any) {
        this.productDescriptionInput = "";
        this.productCodeInput = "";
        this.products = products;
        this.filteredProducts = products;
    }

    confirm() {
        if (this.selectedProduct === undefined) {
            this.confirmed.emit();
        }
        else {
            this.searchProductService.searchedProduct.next(this.selectedProduct);
            this.confirmed.emit();
        }
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
