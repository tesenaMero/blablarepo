import { Component, OnInit, Input } from '@angular/core';
import { OrderDetailApi } from '../../shared/services/api/order-detail.service';
import { ActivatedRoute } from '@angular/router';
import { TranslationService } from '../../shared/services/translation.service';

@Component({
    selector: 'order-detail-page',
    templateUrl: './order-detail.component.html',
    styleUrls: [
        './order-detail.component.scss',
        '../order-builder/order-steps/summary/summary.step.scss'
    ]
})
export class OrderDetailComponent {   
    orderDetailData: any;
    id: any;
    orderRequestId: string;
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
            if (params['orderRequestId'] === null) {
                this.orderRequestId = params['orderRequestId'];                
            }
            if (this.orderRequestId && this.orderRequestId.length > 0) {
                this.id = this.orderRequestId;             
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
            // console.log(parent.items);
            // Change kicker to text
            // Array.prototype.forEach.call(parent.items, child => {
            //     console.log(child.orderItemProfile.kicker);
            //     if (child.orderItemProfile.kicker === 'kicker') {
            //         console.log(child);
            //         // key.orderItemProfile.kicker = "yes";
            //     }
            // });
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
                // console.log(this.jobsite);
                // console.log(this.jobsite.shipmentLocations[this.jobsite.shipmentLocations.length-1].address.addressId);
                this.getStreetJobsite(orderDetailApi ,this.jobsite.shipmentLocations[this.jobsite.shipmentLocations.length-1].address.addressId);
            }
            
            
        });          
    }
    getPod(orderDetailApi) {
        orderDetailApi.shipmentLocationsPOD(this.orderDetailData.pointOfDelivery.pointOfDeliveryId).subscribe((response) => {
            this.pod = response.json();
            if (this.pod.shipmentLocations.length > 0) {
                // console.log(this.pod);
                // console.log(this.pod.shipmentLocations[this.pod.shipmentLocations.length-1].address.addressId);
                this.getStreetPOD(orderDetailApi ,this.pod.shipmentLocations[this.pod.shipmentLocations.length-1].address.addressId);
            }
        });          
    }    
    getStreetJobsite(orderDetailApi, street) {
        orderDetailApi.shipmentLocationsStreet(street).subscribe((response) => {
            this.streetJob = response.json();
            // console.log(this.streetJob);
        });
    }    
    getStreetPOD(orderDetailApi, street) {
        orderDetailApi.shipmentLocationsStreet(street).subscribe((response) => {
            this.streetPOD = response.json();
            // console.log(this.streetPOD);
        });
    }
    // isEmptyObject(myobject, field){
    //     if (`myobject.${field}` === undefined) {
    //         return false;
    //     }
    //     return true;
    // }
}
