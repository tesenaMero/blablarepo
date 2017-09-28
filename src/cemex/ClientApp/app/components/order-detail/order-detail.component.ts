import { Component, OnInit, Input } from '@angular/core';
import { OrderDetailApi } from '../../shared/services/api/order-detail.service';
import { ActivatedRoute } from '@angular/router';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';

@Component({
    selector: 'order-detail-page',
    templateUrl: './order-detail.component.html',
    styleUrls: [
        './order-detail.component.scss',
        '../order-builder/order-steps/review/review.step.scss'
    ]
})
export class OrderDetailComponent {   
    orderDetailData: any;
    id: any;
    type: string;
    orderCode: string;
    businessLine: string;
    private sub: any;
    pod: any;
    jobsite: any;
    streetJob: any;
    streetPOD: any;

    constructor(private orderDetailApi: OrderDetailApi, private route: ActivatedRoute, private t: TranslationService) {
        this.sub = this.route.queryParams.subscribe(params => {
            if (params['orderId']) {
                this.id = params['orderId'];
            }
            if (params['orderCode']) {
                this.orderCode = params['orderCode'];                
            }
            if (params['businessLine']) {
                this.businessLine = params['businessLine'];                
            }
            if (params['typeCode']) {
                this.type = params['typeCode'];                
            }
            if (this.orderCode && this.orderCode.length > 0) {
                this.id = this.orderCode;             
            }
            if (this.orderCode) {
                if (this.businessLine == 'RMX') {
                    this.type = 'ZTRM';
                }
                else {
                    if (this.businessLine == 'CEM') {
                        this.type = 'ZTA';
                    }
                }
            }
        });        

        orderDetailApi.byIdType(this.id, this.type).subscribe((response) => {
            this.orderDetailData = response.json();
            const parent = this.orderDetailData;
            if (this.orderDetailData.salesArea.countryCode.trim() == "MX") { //Point Of Delivery
                this.getJobsite(orderDetailApi);
                this.getPod(orderDetailApi);
            }
            else {
                if (this.orderDetailData.salesArea.countryCode.trim() == "US") { //Jobsite
                    // console.log("In US Job");
                    this.getJobsite(orderDetailApi); 
                }
            }            
        });         
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }  
    getJobsite(orderDetailApi) {
        orderDetailApi.shipmentLocationsJob(this.orderDetailData.jobsite.jobsiteId).subscribe((response) => {
            this.jobsite = response.json();
            if (this.jobsite.shipmentLocations.length > 0) {
                this.getStreetJobsite(orderDetailApi ,this.jobsite.shipmentLocations[this.jobsite.shipmentLocations.length-1].address.addressId);
            }
            
            
        });          
    }
    getPod(orderDetailApi) {
        orderDetailApi.shipmentLocationsPOD(this.orderDetailData.pointOfDelivery.pointOfDeliveryId).subscribe((response) => {
            this.pod = response.json();
            if (this.pod.shipmentLocations.length > 0) {
                this.getStreetPOD(orderDetailApi ,this.pod.shipmentLocations[this.pod.shipmentLocations.length-1].address.addressId);
            }
        });          
    }    
    getStreetJobsite(orderDetailApi, street) {
        orderDetailApi.shipmentLocationsStreet(street).subscribe((response) => {
            this.streetJob = response.json();
        });
    }    
    getStreetPOD(orderDetailApi, street) {
        orderDetailApi.shipmentLocationsStreet(street).subscribe((response) => {
            this.streetPOD = response.json();
        });
    }
}
