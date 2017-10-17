import { Component, OnInit, Input } from '@angular/core';
import { OrderDetailApi } from '../../shared/services/api/order-detail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '@cemex-core/angular-services-v2/dist';
import { DashboardService } from '../../shared/services/dashboard.service'

import * as moment from 'moment'

@Component({
    selector: 'order-detail-page',
    templateUrl: './order-detail.component.html',
    styleUrls: [
        './order-detail.component.scss',
        '../order-builder/order-steps/review/review.step.scss'
    ]
})
export class OrderDetailComponent {   
    //parameters
    orderDetailData: any;
    id: any;
    type: string;
    orderCode: string;
    country: string;
    businessLine: string;

    private sub: any;
    pod: any;
    jobsite: any;
    streetJob: any;
    streetPOD: any;

    countryCode: string;

    constructor(private orderDetailApi: OrderDetailApi, private route: ActivatedRoute, private t: TranslationService, private dashboard: DashboardService, private router: Router) {
        let userLegalEntity = JSON.parse(sessionStorage.getItem('user_legal_entity'));
        this.countryCode = userLegalEntity.countryCode.trim();

        this.sub = this.route.queryParams.subscribe(params => {
            if (params['orderId'] !== null) {
                this.id = params['orderId'];
            }        
            if (params['orderCode'] !== null) {
                this.orderCode = params['orderCode'];                
            }
            if (params['country'] !== null) {
                this.country = params['country'];                
            }    
            if (params['businessLine'] !== null) {
                this.businessLine = params['businessLine'];                
            }

            // New Logic
            if (this.orderCode && this.orderCode.length > 0) {                
                if (this.country && this.businessLine && this.country.trim() == "MX" && this.businessLine == "CEM"){
                    this.type = 'ZTA';
                    this.id = this.orderCode; 
                }
                else {
                    this.type = 'SLS';
                }    
            }
            else {
                this.type = 'REQ';
            }
        });        

        orderDetailApi.byIdType(this.id, this.type).subscribe((response) => {
            this.orderDetailData = response.json();
            const parent = this.orderDetailData;
            if (this.orderDetailData.salesArea.countryCode.trim() == "MX") { //Point Of Delivery
                this.getJobsite();
                this.getPod();
            }
            else {
                if (this.orderDetailData.salesArea.countryCode.trim() == "US") { //Jobsite
                    // console.log("In US Job");
                    this.getJobsite(); 
                }
            }
        }, error => {
            this.dashboard.alertError("Couldn't retrieve the order");
            this.router.navigate(['/ordersnproduct/app/orders']);
        });
    } 

    getJobsite() {
        this.orderDetailApi.shipmentLocationsJob(this.orderDetailData.jobsite.jobsiteId).subscribe((response) => {
            this.jobsite = response.json();
            if (this.jobsite.shipmentLocations.length > 0) {
                this.getStreetJobsite(this.jobsite.shipmentLocations[this.jobsite.shipmentLocations.length-1].address.addressId);
            }
        });
    }

    getPod() {
        this.orderDetailApi.shipmentLocationsPOD(this.orderDetailData.pointOfDelivery.pointOfDeliveryId).subscribe((response) => {
            this.pod = response.json();
            if (this.pod.shipmentLocations.length > 0) {
                this.getStreetPOD(this.pod.shipmentLocations[this.pod.shipmentLocations.length-1].address.addressId);
            }
        });          
    }

    getStreetJobsite(street) {
        this.orderDetailApi.shipmentLocationsStreet(street).subscribe((response) => {
            this.streetJob = response.json();
        });
    }

    getStreetPOD(street) {
        this.orderDetailApi.shipmentLocationsStreet(street).subscribe((response) => {
            this.streetPOD = response.json();
        });
    }

    showRequestTime(time){
       return moment.utc(time).local().format('DD/MM/YYYY, HH:mm A');
    }

    showRegionDate(date){
        if(this.countryCode === 'MX'){
            return moment.utc(date).local().format('DD/MM/YYYY');
        } else {
            return moment.utc(date).local().format('MM/DD/YYYY');
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
