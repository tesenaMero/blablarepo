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
            console.log('data example recieved !!!! ',this.encDecJsonObjService.decodeJson("LS1RZmQxWFg5QkRNMW9qSTBsV2J0OTJRdlJuSXNJU04xWURNd0FETXdBVE9pb2pJbFIyYkRSbmJsMVdkajlHWmlzM1c2SXljMDVXWnRWM1l2Um1Jc0FqT2lRbmIxOVdiQlJuYmwxV2VoQlZaajVXWTJSV1lpd2lJaW9qSWxObWJsSlhabVZtVTA1V1p0bFhZd0pDTHdBVE42SUNkdVYzYnRGa2NsUm1jdkpDTGlJRE14UVRNd1VqTndBakk2SVNaazkyUXlWV2VoQm5Jc0lpTXdFRE54QVROMkFETWlvaklsUjJiRFZHZHBObFl2cG1Jc0lDTzBJek0yRURNMUFETWlvaklsUjJiREpYWnQ5R2R6VjNZaXdpSXdnVE0zSWlPaVVHWnZOVWV1RkdjdDkyWWlzM1c2SVNZMEZHWml3aUkwSlhZajF5WnVsR2N3OUdhekppT2ljM2JvTjFiVTVXWmxKM1l6SkNMaW9GTXpVakw0RWpPd1VqT3lFRFYyRVRMNUFUTDNFRE15SWlPaVVHZGhSbUlzSXljMDVXWnRsWFl3MXljbE5XYXZabmJwSmlPaUFIY0JWMll5VjNiekp5ZQ--"))
            console.log('data recieved -> ', jObj);
            // sessionStorage.setItem("jsonObjDecoded", JSON.stringify(jObj));
            //TODO: remove this
            // this.router.navigate(['/cart']);

            if (!this.checkPayment(jObj)){
                return;
            }
            this.dashboard.alertInfo("Placing order...");
            this.drafts.createOrder(jObj.data[0].orderId).subscribe((response) => {
                this.dashboard.alertSuccess("Order placed successfully!");
                setTimeout(() => {
                    this.router.navigate(['/orders']);
                },3000)
            });
        });
    }

    checkPayment(obj) {
        let res: number;
        obj.data.forEach(el => {
            let toCommit = 0;
            el.documents.forEach(doc => {
                toCommit += doc.toCommit;
            });
            res = el.orderAmount - toCommit;
        });
        return !Boolean(res);
    }

    ngOnDestroy() {
        this._paramsObservable.unsubscribe();
    }
}
