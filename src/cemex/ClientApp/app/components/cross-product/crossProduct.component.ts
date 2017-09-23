import { Component, OnInit, ViewChild } from '@angular/core';
// dto
import { JsonObj } from '../../shared/types/jsonObj';
// router
import { Router, ActivatedRoute } from '@angular/router';
// services
import { EncodeDecodeJsonObjService } from '../../shared/services/encodeDecodeJsonObj.service';
import { DraftsService } from '../../shared/services/api/drafts.service';
import { DashboardService } from '../../shared/services/dashboard.service';
import { ModalService } from '../../shared/components/modal'

@Component({
    selector: 'crossProduct',
    template: `
    <div style="padding: 80px;text-align:center;">Processing...</div>
    <modal id="success-order">
        <div class="success-icon">
            <svg id="icon-accepted-ok" viewBox="0 0 48 48.28" width="100%" height="100%">
                <path class="icon-accepted-ok" d="M19.86,27.56l-5.48-5.48a2,2,0,0,0-2.82,0l-3,3a2,2,0,0,0,0,2.82l9.89,9.89a2,2,0,0,0,2.85,0L39.63,19.45a2,2,0,0,0,0-2.83l-3-3a2,2,0,0,0-2.83,0ZM24,.08A24.14,24.14,0,1,1,0,24.22,24.07,24.07,0,0,1,24,.08Z" transform="translate(0 -0.08)"></path>
            </svg>
        </div>
        <div class="success-text">
            Your order {{ orderCode }} was successfully submited
        </div>
        <div>
            <cemex-action-button title="Back to My Orders History" (click)="closeModal('success-order')">
            </cemex-action-button>
        </div>
    </modal>
    `
})

export class CrossProductComponent implements OnInit {
    private _paramsObservable: any;
    private orderCode: string = "";

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private drafts: DraftsService,
        private dashboard: DashboardService,
        private encDecJsonObjService: EncodeDecodeJsonObjService,
        private modalService: ModalService) {
    }

    ngOnInit(): void {
        // this.dashboard.alertInfo("Placing order...");
        this._paramsObservable = this.route.params.subscribe(params => {
            if (params['id'] === undefined) {
                console.log('No data received in detail');
                return;
            }
            const jObj: JsonObj = this.encDecJsonObjService.decodeJson(params['id']);
            console.log('data example recieved !!!! ', this.encDecJsonObjService.decodeJson("LS1RZmQxWFg5QkRNMW9qSTBsV2J0OTJRdlJuSXNJU04xWURNd0FETXdBVE9pb2pJbFIyYkRSbmJsMVdkajlHWmlzM1c2SXljMDVXWnRWM1l2Um1Jc0FqT2lRbmIxOVdiQlJuYmwxV2VoQlZaajVXWTJSV1lpd2lJaW9qSWxObWJsSlhabVZtVTA1V1p0bFhZd0pDTHdBVE42SUNkdVYzYnRGa2NsUm1jdkpDTGlJRE14UVRNd1VqTndBakk2SVNaazkyUXlWV2VoQm5Jc0lpTXdFRE54QVROMkFETWlvaklsUjJiRFZHZHBObFl2cG1Jc0lDTzBJek0yRURNMUFETWlvaklsUjJiREpYWnQ5R2R6VjNZaXdpSXdnVE0zSWlPaVVHWnZOVWV1RkdjdDkyWWlzM1c2SVNZMEZHWml3aUkwSlhZajF5WnVsR2N3OUdhekppT2ljM2JvTjFiVTVXWmxKM1l6SkNMaW9GTXpVakw0RWpPd1VqT3lFRFYyRVRMNUFUTDNFRE15SWlPaVVHZGhSbUlzSXljMDVXWnRsWFl3MXljbE5XYXZabmJwSmlPaUFIY0JWMll5VjNiekp5ZQ--"))
            console.log('data recieved -> ', jObj);

            if (!this.checkPayment(jObj)) {
                return;
            }
            this.flowCementMX(jObj);
        });
    }

    closeModal(id: string){
        this.modalService.close(id);
        setTimeout(function() {
            this.router.navigate(['/orders']);
        }, 1000);
    }

    flowCementMX(jObj) {
        let data = {
            documents: jObj.data[0].documents
        }

        this.dashboard.alertInfo("Placing order...", 0);
        this.drafts.createOrder(jObj.data[0].orderID, data)
            .flatMap((response) => {
                this.dashboard.alertSuccess("Order placed successfully, requesting order code...", 0);
                return this.drafts.validateRequestId(response.json().id);
            })
            .subscribe((response) => {
                this.orderCode = response.json().orderCode;
                this.dashboard.alertSuccess("Order code: #" + this.orderCode + " placed successfully", 30000);
                this.modalService.open('success-order');
            }, error => {
                this.dashboard.alertError("Error placing order", 10000);
            })
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
