import ProjectProfile from './projectProfile';

export interface IProductSpecification {
    productDescription: string;
    quantity: number;
    unit: string;
    requestDate: string;
    requestTime: string;
    productId: string;
    contract: string;
    deliveryMode: string;
    location?: string;
    pointDelivery?: string;
    unitaryPrice: number;
};


export interface CementPackageSpecification extends IProductSpecification {
    maximumCapacity: number;
    payment: string;
}

export interface ReadymixSpecification extends IProductSpecification {
    projectProfile: ProjectProfile;
    dischargeTime: string;
    transportMethod: string
    pumpCapacityMin: string;
    unloadType:string; 
    pumpCapacityMax: string;
    loadSize: string;
    spacing: string;
    kicker: boolean;

}

export interface CartProductGroup {
    id: number;
    products: CementPackageSpecification[];
}