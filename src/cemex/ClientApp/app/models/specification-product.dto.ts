import ProjectProfile from './projectProfile';

export interface CementPackageSpecification {
    productDescription: string;
    quantity: number;
    unit: string;
    requestDate: string;
    requestTime: string;
    productId: string;
    maximumCapacity: number;
    contract: string;
    payment: string;
    deliveryMode: string;
}

export interface ReadymixSpecification {
    productDescription: string;
    quantity: number;
    unit: string;
    requestDate: string;
    requestTime: string;
    productId: string;
    maximumCapacity: number;
    contract: string;
    payment: string;
    deliveryMode: string;
    projectProfile: ProjectProfile;
}