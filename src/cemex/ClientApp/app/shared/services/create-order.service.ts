import { Injectable } from '@angular/core';
import * as types from '../../shared/types/CreateOrder';
import { Observable } from 'rxjs';
import { ShipmentLocationApi } from './api/shipment-locations.service.api';

/**
 * Create an order for API V2
 */
export interface POD {
    shipmentLocationCode: string;
    shipmentLocationDesc:string;
    shipmentLocationId:number;    
}

@Injectable()
export class CreateOrderService {
    public orderId: number;
    public orderCode: string;
    public orderName: string;
    public createdDateTime: string;
    public updatedDateTime: string;
    public programmedDateTime: string;
    public requestedDateTime: string;
    public draftDateTime: string;
    public purchaseOrder: string;
    public status: types.Status;
    public salesArea: any;
    public orderType: types.OrderType;
    public customer: types.Customer;
    public shippingCondition: types.ShippingCondition;
    public jobsite: any;
    public pointOfDelivery: any;
    public instructions: string;
    public contact: any;
    public user: types.User;
    public items: types.Items;
    public loads: types.Loads;
    public productLine: any;
    public additionalServices: Array<any>;
    public products: Array<any>;
    public product: any;
    public lastStep: any;
    public draftId: any;
    public isPatched: any = false;
    public draftOrder: any;

    constructor() {
        this.initializeOrder();
    }

    initializeOrder(
        orderId?: number,
        orderCode?: string,
        orderName?: string,
        createdDateTime?: string,
        updatedDateTime?: string,
        programmedDateTime?: string,
        requestedDateTime?: string,
        draftDateTime?: string,
        purchaseOrder?: string,
        status?: types.Status,
        salesArea?: types.SalesArea,
        orderType?: types.OrderType,
        customer?: types.Customer,
        shippingCondition?: types.ShippingCondition,
        jobsite?: types.Jobsite,
        pointOfDelivery?: any,
        instructions?: string,
        contact?: any,
        user?: types.User,
        items?: types.Items,
        loads?: types.Loads,
    ) {
        this.orderId = orderId;
        this.orderCode = orderCode;
        this.orderName = orderName;
        this.createdDateTime = createdDateTime;
        this.updatedDateTime = updatedDateTime;
        this.programmedDateTime = programmedDateTime;
        this.requestedDateTime = requestedDateTime;
        this.draftDateTime = draftDateTime;
        this.purchaseOrder = purchaseOrder;
        this.status = status;
        this.salesArea = salesArea;
        this.orderType = orderType;
        this.customer = customer;
        this.shippingCondition = shippingCondition;
        this.jobsite = jobsite;
        this.pointOfDelivery = pointOfDelivery;
        this.instructions = instructions;
        this.contact = contact;
        this.user = user;
        this.items = items;
        this.loads = loads;
    }

    /**
     * Hard coded for now
     * Id, Code, Desc
     * 1  01  DELIVERED / ENTREGADO
     * 2  02  PICK UP / RECOGIDO
     */
    selectDeliveryType(shippingCondition: types.ShippingCondition) {
        this.shippingCondition = shippingCondition;
    }

    selectJobsite(jobsite: types.Jobsite) {
        this.jobsite = jobsite;
    }

    selectPointOfDelivery(pointOfDelivery) {
        this.pointOfDelivery = pointOfDelivery;
    }

    selectContact(contact: types.Contact) {
        this.contact = contact;
        this.contact['contactId'] = Number(this.contact['contactId']);
    }

    selectProductLine(productLine: any) {
        this.productLine = productLine;
    }

    selectAdditionalServices(services: Array<any>) {
        this.additionalServices = services;
    }

    setProducts(products: any[]) {
        this.products = products;
    }

    setProduct(product) {
        this.product = product;
    }

    getSalesDocumentType() {
        const READYMIX_LINE = 6;
        let salesDocumentType = '3';
        if (this.productLine.productLineId == READYMIX_LINE) {
            salesDocumentType = '1';
        }

        return salesDocumentType;
    }

    resetOrder() {
        this.initializeOrder();
    }

    getCatalogOptions(): Promise<any> {
        let catalogOptionsMock = { "catalogs": [{ "catalogId": 64, "catalogName": "Unload Type Catalog", "catalogCode": "ULT", "entries": [{ "entryId": 1, "entryCode": "Direct", "entryDesc": "Direct" }, { "entryId": 2, "entryCode": "Pump", "entryDesc": "Pump" }, { "entryId": 3, "entryCode": "Barrow", "entryDesc": "Barrow" }, { "entryId": 4, "entryCode": "Bucket", "entryDesc": "Bucket" }] }, { "catalogId": 65, "catalogName": "Transport Method Catalog", "catalogCode": "TPM", "entries": [{ "entryId": 1, "entryCode": "Truck               ", "entryDesc": "Truck Lift" }] }, { "catalogId": 66, "catalogName": "Time Per Load Catalog", "catalogCode": "TPL", "entries": [{ "entryId": 14, "entryCode": "10", "entryDesc": "10 min" }, { "entryId": 15, "entryCode": "15", "entryDesc": "15 min" }, { "entryId": 1, "entryCode": "20", "entryDesc": "20 min" }, { "entryId": 16, "entryCode": "25", "entryDesc": "25 min" }, { "entryId": 2, "entryCode": "30", "entryDesc": "30 min" }, { "entryId": 17, "entryCode": "35", "entryDesc": "35 min" }, { "entryId": 3, "entryCode": "40", "entryDesc": "40 min" }, { "entryId": 18, "entryCode": "45", "entryDesc": "45 min" }, { "entryId": 4, "entryCode": "50", "entryDesc": "50 min" }, { "entryId": 19, "entryCode": "55", "entryDesc": "55 min" }, { "entryId": 13, "entryCode": "100", "entryDesc": "1 hour" }, { "entryId": 20, "entryCode": "110", "entryDesc": "1hour 10min" }, { "entryId": 5, "entryCode": "120", "entryDesc": "1 hour 20 min" }, { "entryId": 6, "entryCode": "130", "entryDesc": "1 hour 30 min" }, { "entryId": 7, "entryCode": "140", "entryDesc": "1 hour 40 min" }, { "entryId": 21, "entryCode": "150", "entryDesc": "1hour 50min" }, { "entryId": 8, "entryCode": "200", "entryDesc": "2 hour" }] }, { "catalogId": 71, "catalogName": "Pump Capacity Catalog", "catalogCode": "PCC", "entries": [{ "entryId": 1, "entryCode": "0102", "entryDesc": "28 m3/h" }, { "entryId": 2, "entryCode": "103", "entryDesc": "32 m3/h" }, { "entryId": 3, "entryCode": "104", "entryDesc": "36 m3/h" }, { "entryId": 9, "entryCode": "106", "entryDesc": "38 m3/h" }, { "entryId": 4, "entryCode": "105", "entryDesc": "40 m3/h" }, { "entryId": 6, "entryCode": "107", "entryDesc": "41 m3/h" }, { "entryId": 7, "entryCode": "108", "entryDesc": "42 m3/h" }, { "entryId": 8, "entryCode": "109", "entryDesc": "Any" }] }, { "catalogId": 72, "catalogName": "Load Size Catalog", "catalogCode": "LSC", "entries": [{ "entryId": 5, "entryCode": "7m3", "entryDesc": "7m3" }, { "entryId": 4, "entryCode": "6m3", "entryDesc": "6m3" }, { "entryId": 3, "entryCode": "5m3", "entryDesc": "5m3" }, { "entryId": 2, "entryCode": "4m3", "entryDesc": "4m3" }, { "entryId": 1, "entryCode": "3m3", "entryDesc": "3m3" }, { "entryId": 8, "entryCode": "2m3", "entryDesc": "2m3" }, { "entryId": 7, "entryCode": "1m3", "entryDesc": "1m3" }] }, { "catalogId": 74, "catalogName": "Discharge Time Catalog", "catalogCode": "DCT", "entries": [{ "entryId": 3, "entryDesc": "10 minutes" }, { "entryId": 2, "entryDesc": "15 minutes" }, { "entryId": 4, "entryDesc": "20 minutes" }, { "entryId": 5, "entryDesc": "25 minutes" }, { "entryId": 6, "entryDesc": "30 minutes" }, { "entryId": 7, "entryDesc": "35 minutes" }, { "entryId": 8, "entryDesc": "40 minutes" }, { "entryId": 9, "entryDesc": "45 minutes" }, { "entryId": 10, "entryDesc": "50 minutes" }, { "entryId": 11, "entryDesc": "55 minutes" }, { "entryId": 12, "entryDesc": "1 hour" }, { "entryId": 13, "entryDesc": "1 hour 10 minutes" }, { "entryId": 14, "entryDesc": "1 hour 20 minutes" }, { "entryId": 15, "entryDesc": "1 hour 30 minutes" }, { "entryId": 16, "entryDesc": "1 hour 40 minutes" }, { "entryId": 17, "entryDesc": "1 hour 50 minutes" }, { "entryId": 18, "entryDesc": "2 hours" }] }, { "catalogId": 76, "catalogName": "Additional Service Catalog", "catalogCode": "ASC", "entries": [{ "entryId": 7, "entryCode": "EXTHOU", "entryDesc": "Extra Hours" }, { "entryId": 8, "entryCode": "SUNHOL", "entryDesc": "Sunday / Holiday Service" }, { "entryId": 10, "entryCode": "PIPESELECTION", "entryDesc": "Pipe selections" }] }, { "catalogId": 79, "catalogName": "Element Catalog", "catalogCode": "ELM", "entries": [{ "entryId": 6, "entryCode": "Sewer", "entryDesc": "Sewer" }, { "entryId": 7, "entryCode": "Attraction", "entryDesc": "Attraction" }, { "entryId": 8, "entryCode": "Bacheo", "entryDesc": "Bacheo" }, { "entryId": 9, "entryCode": "Bados", "entryDesc": "Bados" }, { "entryId": 10, "entryCode": "Sidewalk", "entryDesc": "Sidewalk" }, { "entryId": 11, "entryCode": "Barrier", "entryDesc": "Barrier" }, { "entryId": 12, "entryCode": "Base", "entryDesc": "Base" }, { "entryId": 13, "entryCode": "Head", "entryDesc": "Head" }, { "entryId": 14, "entryCode": "Channel", "entryDesc": "Channel" }, { "entryId": 15, "entryCode": "Capital", "entryDesc": "Capital" }, { "entryId": 16, "entryCode": "Shells", "entryDesc": "Shells" }, { "entryId": 17, "entryCode": "Castle", "entryDesc": "Castle" }, { "entryId": 18, "entryCode": "Celdas", "entryDesc": "Celdas" }, { "entryId": 19, "entryCode": "Enclosure", "entryDesc": "Enclosure" }, { "entryId": 20, "entryCode": "Foundation", "entryDesc": "Foundation" }, { "entryId": 21, "entryCode": "Tank", "entryDesc": "Tank" }, { "entryId": 22, "entryCode": "Column", "entryDesc": "Column" }, { "entryId": 23, "entryCode": "Concrete Ciclopeo", "entryDesc": "Concrete Ciclopeo" }, { "entryId": 24, "entryCode": "Contract", "entryDesc": "Contract" }, { "entryId": 25, "entryCode": "Laces", "entryDesc": "Laces" }, { "entryId": 26, "entryCode": "Crown", "entryDesc": "Crown" }, { "entryId": 27, "entryCode": "Cover", "entryDesc": "Cover" }, { "entryId": 28, "entryCode": "Bucket", "entryDesc": "Bucket" }, { "entryId": 29, "entryCode": "Cubes", "entryDesc": "Cubes" }, { "entryId": 30, "entryCode": "Ditch", "entryDesc": "Ditch" }, { "entryId": 31, "entryCode": "Dices", "entryDesc": "Dices" }, { "entryId": 32, "entryCode": "Dala", "entryDesc": "Dala" }, { "entryId": 33, "entryCode": "Dentellon", "entryDesc": "Dentellon" }, { "entryId": 34, "entryCode": "Waste", "entryDesc": "Waste" }, { "entryId": 35, "entryCode": "Dflt", "entryDesc": "Dflt" }, { "entryId": 36, "entryCode": "Diaphragm", "entryDesc": "Diaphragm" }, { "entryId": 37, "entryCode": "Diamonds", "entryDesc": "Diamonds" }, { "entryId": 38, "entryCode": "Dove", "entryDesc": "Dove" }, { "entryId": 39, "entryCode": "Empastado", "entryDesc": "Empastado" }, { "entryId": 40, "entryCode": "Cooling", "entryDesc": "Cooling" }, { "entryId": 41, "entryCode": "Stairs", "entryDesc": "Stairs" }, { "entryId": 42, "entryCode": "Scams", "entryDesc": "Scams" }, { "entryId": 43, "entryCode": "Print", "entryDesc": "Print" }, { "entryId": 44, "entryCode": "Stirrup", "entryDesc": "Stirrup" }, { "entryId": 45, "entryCode": "Firm", "entryDesc": "Firm" }, { "entryId": 46, "entryCode": "Pit", "entryDesc": "Pit" }, { "entryId": 47, "entryCode": "Generic", "entryDesc": "Generic" }, { "entryId": 48, "entryCode": "Garrison", "entryDesc": "Garrison" }, { "entryId": 49, "entryCode": "Footprints", "entryDesc": "Footprints" }, { "entryId": 50, "entryCode": "Laundry rooms", "entryDesc": "Laundry rooms" }, { "entryId": 51, "entryCode": "Slab", "entryDesc": "Slab" }, { "entryId": 52, "entryCode": "Slab", "entryDesc": "Slab" }, { "entryId": 53, "entryCode": "Losa cimentacion", "entryDesc": "Losa cimentacion" }, { "entryId": 54, "entryCode": "Losa entrepiso", "entryDesc": "Losa entrepiso" }, { "entryId": 55, "entryCode": "Incline", "entryDesc": "Incline" }, { "entryId": 56, "entryCode": "Bag", "entryDesc": "Bag" }, { "entryId": 57, "entryCode": "Masonry", "entryDesc": "Masonry" }, { "entryId": 58, "entryCode": "Mold", "entryDesc": "Mold" }, { "entryId": 59, "entryCode": "Plant mold", "entryDesc": "Plant mold" }, { "entryId": 60, "entryCode": "Ground floor mold", "entryDesc": "Ground floor mold" }, { "entryId": 61, "entryCode": "Walls", "entryDesc": "Walls" }, { "entryId": 62, "entryCode": "Others", "entryDesc": "Others" }, { "entryId": 63, "entryCode": "Parapet", "entryDesc": "Parapet" }, { "entryId": 64, "entryCode": "Pavement", "entryDesc": "Pavement" }, { "entryId": 65, "entryCode": "Pedestal", "entryDesc": "Pedestal" }, { "entryId": 66, "entryCode": "Pilots", "entryDesc": "Pilots" }, { "entryId": 67, "entryCode": "Floor", "entryDesc": "Floor" }, { "entryId": 68, "entryCode": "Template", "entryDesc": "Template" }, { "entryId": 69, "entryCode": "Water well", "entryDesc": "Water well" }, { "entryId": 70, "entryCode": "Ramp", "entryDesc": "Ramp" }, { "entryId": 71, "entryCode": "Registry", "entryDesc": "Registry" }, { "entryId": 72, "entryCode": "Filling", "entryDesc": "Filling" }, { "entryId": 73, "entryCode": "Talud", "entryDesc": "Talud" }, { "entryId": 74, "entryCode": "Ceiling", "entryDesc": "Ceiling" }, { "entryId": 75, "entryCode": "Work", "entryDesc": "Work" }, { "entryId": 76, "entryCode": "Trench", "entryDesc": "Trench" }, { "entryId": 77, "entryCode": "Beam", "entryDesc": "Beam" }, { "entryId": 78, "entryCode": "Joist", "entryDesc": "Joist" }, { "entryId": 79, "entryCode": "Ditch", "entryDesc": "Ditch" }, { "entryId": 80, "entryCode": "Shoe", "entryDesc": "Shoe" }] }] }
        return new Promise((resolve, reject) => { resolve(catalogOptionsMock) });
    }

    dataToSave() {
        let orderName = this.productLine.productLineId != 6 ? "Cement Online Order" : "Redymix Request";
        const customer = JSON.parse(sessionStorage.getItem('currentCustomer'));

        let items = [];
        this.products.forEach((product, i) => {
            let item;
            item.itemSeqNum = 10 * (i+1);
            item.purchaseOrder = this.purchaseOrder;
            item["requestedDateTime"] = this.requestedDateTime;
            item.currency = 'MXN';
            item = {
                "itemSeqNum": 10 * (i+1),
                "purchaseOrder": this.purchaseOrder,
                "requestedDateTime": this.requestedDateTime,
                "currency": {
                    "currencyCode": "MXN"
                },
                "quantity": product.quantity,
                "product": {
                    "productId": product.product.productId
                },
                "uom": {
                    "unitId": 262
                },
                "paymentTerm": {
                    "paymentTermId": 43
                },
                "orderItemProfile": {
                    "additionalServices": [
                        {
                            "additionalServiceCode": "MANEUVERING"
                        }
                    ]
                }
            }            
        })
        return {
            "orderName": orderName,
            "requestedDateTime": this.requestedDateTime,
            "purchaseOrder": this.purchaseOrder,
            "salesArea": {
                "salesAreaId": this.salesArea[0].jobsiteSalesAreaId
            },
            "customer": {
                "customerId": customer.legalEntityTypeCode
            },
            "shippingCondition": {
                "shippingConditionId": this.shippingCondition.shippingConditionId
            },
            "jobsite": {
                "jobsiteId": this.jobsite.shipmentLocationId
            },
            "pointOfDelivery": {
                "pointOfDeliveryId": this.pointOfDelivery.shipmentLocationId
            },
            "instructions": this.instructions,
            "contact": {
                "contactId": this.contact.contactId
            },
            "items": items
        }
    }
}
