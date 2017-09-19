import { Component, OnInit } from '@angular/core';
import { OrderDetailApi } from '../../shared/services/api/order-detail.service';

let $ = require("jquery");

@Component({
    selector: 'page-modal',
    templateUrl: './modal.html',
    styleUrls: ['./modal.scss']
})
export class Modal {
    text: any;
    requestId: number = 90;
    response: any;
    constructor(request: OrderDetailApi) {                
        this.text = "The request " + this.requestId + " is successful created" +
        "\n Code: " + "234DC34";        
        // $('#myModal').modal('show');
        // request.validateRequestId(this.requestId).subscribe((response) => {
        //     this.response = response.json();
        //     console.log("validateRequestId", this.response);                 
        // });
    }
}
