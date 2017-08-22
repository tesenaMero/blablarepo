import { Injectable } from '@angular/core';
import * as types from '../../shared/types/CreateOrder';

/**
 * Create an order for API V2
 */
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
        public salesArea: types.SalesArea;
        public orderType: types.OrderType;
        public customer: types.Customer;
        public shippingCondition: types.ShippingCondition;
        public jobsite: types.Jobsite;
        public pointOfDelivery: types.PointOfDelivery;
        public instructions: string;
        public contact: types.Contact;
        public user: types.User;
        public items: types.Items;
        public loads: types.Loads;

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
        pointOfDelivery?: types.PointOfDelivery,
        instructions?: string,
        contact?: types.Contact,
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
        this.orderType= orderType;
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

    selectPointOfDelivery(pointOfDelivery: types.PointOfDelivery) {
        this.pointOfDelivery = pointOfDelivery;
    }

    selectContact(contact: types.Contact) {
        this.contact = contact;
    }

    resetOrder() {
        this.initializeOrder();
    }
}
