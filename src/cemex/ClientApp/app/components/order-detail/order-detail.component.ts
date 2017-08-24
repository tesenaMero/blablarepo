import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'order-detail-page',
    templateUrl: './order-detail.component.html',
    styleUrls:  ['./order-detail.component.scss',
                 '../orders-table/orders-table.scss',
                 '../orders-table/orders-table.specific.scss',
                 '../order-builder/order-steps/summary/summary.step.scss'                      
                ]
})
export class OrderDetailComponent implements OnInit {
    order = 7543189;
    requestDate = "31/12/2017, 15:00 - 16:00";
    @Input() show: boolean = false;
    constructor() { 
    }

    ngOnInit() {
    }


    changeTabComments(){
        document.getElementById("products").classList.remove('active');
        document.getElementById("comments").classList.add('active');  
        this.show = true;
    }
/* Waiting for invision    
    changeTabAction(){
    }     
*/    

    testTab(){
        
    }
    changeTabProducts(){
        document.getElementById("comments").classList.remove('active');
        document.getElementById("products").classList.add('active'); 
        this.show = false;
    } 

}
