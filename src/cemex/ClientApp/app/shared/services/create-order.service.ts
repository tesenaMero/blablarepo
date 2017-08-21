import { Injectable } from '@angular/core';

interface Status {
    statusId: number;
    statusDesc: string;
}

interface BusinessLine {
    businessLineId: number;
    businessLineCode: string;
    businessLineDesc: string;
}

interface SalesArea {
    salesAreaId: number;
    salesOrganizationCode: string;
    countryCode: string;
    divisionCode: string;
    channelCode: string;
    businessLine: BusinessLine;
}

interface OrderType {
    orderTypeId: number;
    orderTypeDesc: string;
}

interface CustomerSegment {
    customerSegmentId: number;
    customerSegmentCode: string;
    customerSegmentDesc: string;
}

interface Customer {
    customerId: number;
    customerCode: string;
    customerDesc: string;
    customerSegment: CustomerSegment;
}

interface ShippingCondition {
    shippingConditionId: number;
    shippingConditionCode: string;
    shippingConditionDesc: string;
}

/**
 * Create an order for API V2
 */

@Injectable()
export class CreateOrder {
        public orderId;
        public orderCode;
        public orderName;
        public createdDateTime;
        public updatedDateTime;
        public programmedDateTime;
        public requestedDateTime;
        public draftDateTime;
        public purchaseOrder;
        public status: Status;
        public salesArea: SalesArea;
        public orderType: OrderType;
        public customer: Customer;
        public shippingCondition: ShippingCondition;

    constructor(
        orderId,
        orderCode,
        orderName,
        createdDateTime,
        updatedDateTime,
        programmedDateTime,
        requestedDateTime,
        draftDateTime,
        purchaseOrder,
        status: Status,
        salesArea: SalesArea,
        orderType: OrderType,
        customer: Customer,
        shippingCondition: ShippingCondition,
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

    }

    // ETC

    // selectDeliveryType() {

    // }

    // selectJobsite() {

    // }

    // selectContact() {

    // }

    // setSpecialInstructions() {

    // }

    // addProduct() {

    // }

    // removeProduct() {

    // }
}
