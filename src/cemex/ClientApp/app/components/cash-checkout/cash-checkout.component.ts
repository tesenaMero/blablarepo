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
import { TranslationService } from '@cemex-core/angular-services-v2/dist';

@Component({
    selector: 'cash-checkout',
    styleUrls: ['./cash-checkout.scss'],
    templateUrl: './cash-checkout.html',
})

export class CashCheckoutComponent implements OnInit {
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
        console.log('data example recieved !!!! ', this.encDecJsonObjService.decodeJson("LS1RZmQxWFg5QkRNMW9qSTBsV2J0OTJRdlJuSXNJU04xWURNd0FETXdBVE9pb2pJbFIyYkRSbmJsMVdkajlHWmlzM1c2SXljMDVXWnRWM1l2Um1Jc0FqT2lRbmIxOVdiQlJuYmwxV2VoQlZaajVXWTJSV1lpd2lJaW9qSWxObWJsSlhabVZtVTA1V1p0bFhZd0pDTHdBVE42SUNkdVYzYnRGa2NsUm1jdkpDTGlJRE14UVRNd1VqTndBakk2SVNaazkyUXlWV2VoQm5Jc0lpTXdFRE54QVROMkFETWlvaklsUjJiRFZHZHBObFl2cG1Jc0lDTzBJek0yRURNMUFETWlvaklsUjJiREpYWnQ5R2R6VjNZaXdpSXdnVE0zSWlPaVVHWnZOVWV1RkdjdDkyWWlzM1c2SVNZMEZHWml3aUkwSlhZajF5WnVsR2N3OUdhekppT2ljM2JvTjFiVTVXWmxKM1l6SkNMaW9GTXpVakw0RWpPd1VqT3lFRFYyRVRMNUFUTDNFRE15SWlPaVVHZGhSbUlzSXljMDVXWnRsWFl3MXljbE5XYXZabmJwSmlPaUFIY0JWMll5VjNiekp5ZQ--"))

        var retrievedObject = localStorage.getItem('tempCashOrders');
        console.log('tempCashOrders: ', JSON.parse(retrievedObject));
    }
}
