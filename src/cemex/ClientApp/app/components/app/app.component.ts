import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CountlyService } from '@cemex-core/helpers-v1';

const Autobind = require('core-decorators').autobind;

let $ = require("jquery");

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private router: Router, private countly: CountlyService) { }

    @Autobind
    backToOrders() {
        let that = this;
        setTimeout(function () {
            that.router.navigate(['/ordersnproduct/app/orders']);
        }, 1000);
    }

    ngOnInit() {
        let a = `
                         ,#######,   ,#######,                                           
                       .$#$$$$&*   #######&*                                            
                      ¡#$$$$&&   $#######*                                              
                    ¡#$$$$$&'  ¡#######*                                                
                  ¡#$$$$$&'  ¡#######"                                                  
                ¡$$$$$$&*  ¡#######&                                                    
              ¡$#$$$$&*  ¡#######&¨ ¡##################$##########,$###########&    ¡###
            ,$#$$$$&*  ,#######&'   ]#&¨     ]#&¨¡&&&&¡¡##¨|##¨¨##&##&,¡&&&¡,"*######&* 
          .$#$$$$$*  ,#######&*     $#&,,,,, ]##¡|*****!## :##  ##&##&|******¡###&$###¡ 
         ¡$$$$$$*   (######&*       *$######&&$#######&!#& :##  ##&$###########&    "$#&
        `;

        console.log(a);
        this.countly.init();
        this.countly.startService('https://cemex.count.ly', '724210ee880361556c149088d4432c75c134a0e2');
    }

}
