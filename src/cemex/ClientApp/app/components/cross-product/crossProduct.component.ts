import { Component, OnInit } from '@angular/core';
// dto
import { JsonObj } from '../../shared/types/jsonObj';
// router
import { Router, ActivatedRoute } from '@angular/router';
// services
import { EncodeDecodeJsonObjService } from '../../shared/services/encodeDecodeJsonObj.service';
import { DraftsService } from '../../shared/services/api/drafts.service';
import { DashboardService } from '../../shared/services/dashboard.service';

@Component({
    selector: 'crossProduct',
    template: '<div style="padding: 80px;text-align:center;">Processing...</div>',
    providers: [EncodeDecodeJsonObjService]
})
export class CrossProductComponent implements OnInit {
    private _paramsObservable: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private drafts: DraftsService,
        private dashboard: DashboardService,
        private encDecJsonObjService: EncodeDecodeJsonObjService) {
    }

    ngOnInit(): void {
        // this.dashboard.alertInfo("Placing order...");
        this._paramsObservable = this.route.params.subscribe(params => {
            if (params['id'] === undefined) {
                console.log('No data received in detail');
                return;
            }
            const jObj: JsonObj = this.encDecJsonObjService.decodeJson(params['id']);
            console.log('data recieved -> ', jObj);
            // sessionStorage.setItem("jsonObjDecoded", JSON.stringify(jObj));
            //TODO: remove this
            // this.router.navigate(['/cart']);
            this.drafts.createOrder(jObj.data[0].orderId).subscribe((response) => {
                this.dashboard.alertSuccess("Order placed successfully!");
            });
        });
    }

    ngOnDestroy() {
        this._paramsObservable.unsubscribe();
    }
}
