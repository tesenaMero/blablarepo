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
    shipmentLocationId: number;    
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
    public restored = false;
    public shipmentLocation: any;

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
        products?: any,
        productLine?: any
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
        this.products = products;
        this.productLine = productLine;
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

    resetOrder() {
        this.initializeOrder();
    }
}
