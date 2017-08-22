/**
 * OrderManagement V2
 * Types for order management API
 */

export interface Status {
    statusId: number;
    statusDesc: string;
}

export interface BusinessLine {
    businessLineId: number;
    businessLineCode: string;
    businessLineDesc: string;
}

export interface SalesArea {
    salesAreaId: number;
    salesOrganizationCode: string;
    countryCode: string;
    divisionCode: string;
    channelCode: string;
    businessLine: BusinessLine;
}

export interface OrderType {
    orderTypeId: number;
    orderTypeDesc: string;
}

export interface CustomerSegment {
    customerSegmentId: number;
    customerSegmentCode: string;
    customerSegmentDesc: string;
}

export interface Customer {
    customerId: number;
    customerCode: string;
    customerDesc: string;
    customerSegment: CustomerSegment;
}

export interface ShippingCondition {
    shippingConditionId: number;
    shippingConditionCode?: string;
    shippingConditionDesc?: string;
}

export interface Jobsite {
    jobsiteId: number;
    jobsiteCode?: string;
    jobsiteDesc?: string;
}

export interface PointOfDelivery {
    pointOfDeliveryId: number;
    pointOfDeliveryCode?: string;
    pointOfDeliveryDesc?: string;
}

export interface Contact {
    contactName: string;
    contactPhone: string;
}

export interface User {
    userId: number;
    userAccount: string;
    email: string;
}

export interface ProductType {
    productTypeId: number;
    productTypeCode?: string;
    productTypeDesc?: string;
}

export interface Product {
    productId: number;
    productCode: string;
    productDesc: string;
    productHierarchy: string;
    isFinished: boolean;
    availabilityCheck: boolean;
    productType: ProductType;
}

export interface Uom {
    unitId: number;
    unitCode?: string;
    unitDesc?: string;
}

export interface Element {
    elementId: number;
    elementCode?: string;
    elementDesc?: string;
}

export interface TimePerLoad {
    timePerLoadId: number;
    timePerLoadCode: string;
    timePerLoadDesc: string;
}

export interface LoadSize {
    loadSizeId: number;
    loadSizeCode: string;
    loadSizeDesc: string;
}

export interface UnloadType {
    unloadTypeId: number;
    unloadTypeCode: string;
    unloadTypeDesc: string;
}

export interface PumpCapacity {
    pumpCapacityId: number;
    pumpCapacityCode: string;
    pumpCapacityDesc: string;
}

export interface TransportMethod {
    transportMethodId: number;
    transportMethodCode: string;
    transportMethodDesc: string;
}

export interface DischargeTime {
    dischargeTimeId: number;
    timePerDischargeDesc: string;
}

export interface Reccurence {
    reccurenceId: number;
    reccurenceDesc: string;
}

export interface AdditionalService {
    additionalServiceId: number;
    additionalServiceCode: string;
    additionalServiceDesc: string;
}

export interface OrderItemProfile {
    slump: number;
    kicker: boolean;
    element: Element;
    timePerLoad: TimePerLoad;
    loadSize: LoadSize;
    unloadType: UnloadType;
    pumpCapacity: PumpCapacity;
    transportMethod: TransportMethod;
    dischargeTime: DischargeTime;
    reccurence: Reccurence;
    additionalServices: AdditionalService;
}

export interface Currency {
    currencyId: number;
    currencyCode: string;
    currencyDesc: string;
}

export interface Agreement {
    agreementId: number;
    agreementCode: string;
    currency: Currency;
}

export interface PaymentTerm {
    paymentTermId: number;
    paymentTermCode: string;
    paymentTermDesc: string;
}

export interface GeoPlace {
    geoFenceRadius: string;
    longitude: string;
    latitude: string;
    geoPlaceType: string;
}

export interface Address {
    addressId: number;
    addressCode: string;
    cityDesc: string;
    countryCode: string;
    domicileNum: string;
    postalCode: string;
    regionCode: string;
    regionDesc: string;
    settlementDesc: string;
    streetName: string;
    geoPlace: GeoPlace;
}

export interface ShippingSource {
    shippingSourceId: number;
    shippingSourceCode: string;
    shippingSourceDesc: string;
    address: Address;
}

export interface LoadItem {
    loadItemId: number;
    loadItemCode: string;
    itemSeqNum: number;
    quantity: number;
    deliveryGroup: number;
    product: Product;

}

export interface OrderItem {
    orderItemId: number;
    quantity: number;
    extendedPrice: number;
    unitPrice: number;
    totalPrice: number;
    product: Product;
    uom: Uom;
    orderItemProfile: OrderItemProfile;
    agreement: Agreement;
    paymentTerm: PaymentTerm;
    shippingSource: ShippingSource;
    loadItem: LoadItem;
}

export type Items = OrderItem[];

export interface CounterOffer {
    proposedDateTimeId: number;
    proposedDate: string;
    proposedTimeFrom: string;
    proposedTimeTo: string;
}

export interface RequestDateTime {
    requestedDateTimeId: number;
    requestedDate: string;
    requestedTime: string;
    dateTimePriority: number;
}

export interface ShippingLocation {
    shippingConditionId: number;
    shippingConditionCode: string;
    shippingConditionDesc: string;
}

export interface Shipment {
    shipmentId: number;
    shipmentCode: string;
    shipmentTime: number;
    shipmentDistance: number;
    shippingSource: ShippingSource;
    shippingLocation: ShippingLocation;
    shippingCondition: ShippingCondition;
}

export interface Load {
    loadId: number;
    loadCode: string;
    loadDateTime: string;
    programmedDateTime: string;
    loadNumber: string;
    items: {};
    counterOffers: CounterOffer[];
    shipment: Shipment;
    isCapable: boolean;
    status: Status;
    requestDateTimes: RequestDateTime[];
}

export type Loads = Load;
