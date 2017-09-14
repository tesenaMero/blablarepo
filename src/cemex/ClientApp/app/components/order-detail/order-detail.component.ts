import { Component, OnInit, Input } from '@angular/core';
import { OrderDetailApi } from '../../shared/services/api/order-detail.service';
import { ActivatedRoute } from '@angular/router';

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
    id: number;
    type: string = "SLS";
    private sub: any;
    pod: any;
    jobsite: any;
    streetJob: any;
    streetPOD: any;

    constructor(private orderDetailApi: OrderDetailApi, private route: ActivatedRoute) {
        this.sub = this.route.queryParams.subscribe(params => {
            this.id = params['orderId'];
            if (params['typeCode'] && params['typeCode'] == "ZTA") {
                this.type = "SLS";
            } 
            else {
                if (params['typeCode']) {
                    this.type = params['typeCode'];
                }
            }
        });        
        orderDetailApi.byIdType(this.id, this.type).subscribe((response) => {
            this.orderDetailData = response.json();
            console.log(response);
            if (this.orderDetailData.salesArea.countryCode.trim() == "MX") { //Point Of Delivery
                this.getJobsite(orderDetailApi);
                this.getPod(orderDetailApi);
            }
            else {
                if (this.orderDetailData.salesArea.countryCode.trim() == "US") { //Jobsite
                    console.log("In US Job");
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
                console.log(this.jobsite);
                // console.log(this.jobsite.shipmentLocations[this.jobsite.shipmentLocations.length-1].address.addressId);
                this.getStreetJobsite(orderDetailApi ,this.jobsite.shipmentLocations[this.jobsite.shipmentLocations.length-1].address.addressId);
            }
            
            
        });          
    }
    getPod(orderDetailApi) {
        orderDetailApi.shipmentLocationsPOD(this.orderDetailData.pointOfDelivery.pointOfDeliveryId).subscribe((response) => {
            this.pod = response.json();
            if (this.pod.shipmentLocations.length > 0) {
                console.log(this.pod);
                // console.log(this.pod.shipmentLocations[this.pod.shipmentLocations.length-1].address.addressId);
                this.getStreetPOD(orderDetailApi ,this.pod.shipmentLocations[this.pod.shipmentLocations.length-1].address.addressId);
            }
        });          
    }    
    getStreetJobsite(orderDetailApi, street) {
        orderDetailApi.shipmentLocationsStreet(street).subscribe((response) => {
            this.streetJob = response.json();
            console.log(this.streetJob);
        });
    }    
    getStreetPOD(orderDetailApi, street) {
        orderDetailApi.shipmentLocationsStreet(street).subscribe((response) => {
            this.streetPOD = response.json();
            console.log(this.streetPOD);
        });
    }
}
