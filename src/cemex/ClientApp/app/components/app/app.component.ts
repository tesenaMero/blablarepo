import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

const Autobind = require('core-decorators').autobind;

let $ = require("jquery");

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private router: Router) {}
    closeModal() {
        $("#app-content").removeClass("blur");
    }
    @Autobind
    backToOrders() {
        let that = this;
        setTimeout(function() {
            that.router.navigate(['/orders']);
        }, 1000);
    }

    ngOnInit() {

    }
    
}
