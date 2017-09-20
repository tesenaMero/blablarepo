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
    requestId: number = 3;
    response: any;
    constructor(request: OrderDetailApi) {     
        request.validateRequestId(this.requestId).subscribe((response) => {
            this.response = response.json();     
            this.text = this.response.orderCode.trim() + "\n";     
            let fields = this.response.messages.split('|');        
            for (let i = 0; i < fields.length; ++i) { 
                if (fields[i].trim()) {
                    console.log(i, fields[i]);
                    this.text += fields[i].trim() + " \n";
                }
            }    
                    
        });
    }
    openModal() {
        // $("#app-content").addClass("blur");
        // $('#myModal').modal('show');
    }
}
