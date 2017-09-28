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
import { TranslationService } from '../../shared/services/translation.service'

@Component({
    selector: 'crossProduct',
    styleUrls: ['./crossProduct.scss'],
    template: `
    <div style="padding: 80px;text-align:center;">this.t.pt('views.common.procesing')</div>
    <modal id="success-order">
        <div class="container-fluid">
            <div class="container-layout center-text center-content">
                <div class="success-group">
                    <span class="cmx-icon-accepted-ok"></span>
                    <div class="success-text">
                    {{ this.t.pt('views.common.order_code') }} {{ orderCode }} {{ this.t.pt('views.common.was_submited') }}
                    </div>
                    <button class="button back-to-orders" (click)="closeModal()">{{ this.t.pt('views.cross.back_orders') }}</button>
                </div>
            </div>
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
        private modalService: ModalService,
        private t: TranslationService
        ) {
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

        this.dashboard.alertInfo(this.t.pt('views.common.placing'), 0);
        this.drafts.createOrder(jObj.data[0].orderID, data)
            .flatMap((response) => {
                this.dashboard.alertSuccess(this.t.pt('views.common.placed'), 0);
                return this.drafts.validateRequestId(response.json().id);
            })
            .subscribe((response) => {
                this.orderCode = response.json().orderCode;
                this.dashboard.alertSuccess(this.t.pt('views.common.order_code') + this.orderCode + " " + this.t.pt('views.common.placed_success'), 30000);
                this.modalService.open('success-order');
            }, error => {
                this.dashboard.alertError(this.t.pt('views.common.error_placing'), 10000);
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
