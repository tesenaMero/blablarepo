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
        console.log('data example recieved !!!! ', this.encDecJsonObjService.decodeJson("LTBYWDkxMVc2SXljMDVXWnRWM1l2Um1Jc2dUTndJak9pUVVTeVZHWnk5bUlzQWpPaVFuYjE5V2JCUm5ibDFXZWhCVlpqNVdZMlJXWWl3aUlpb2pJbE5tYmxKWFptVm1VMDVXWnRsWFl3SkNMeWdqTDRFRE53RWpPaVFuYjE5V2JCSlhaa0ozYml3aUk0SURPNEFETXdVRE13SWlPaVVHWnZOa2NsbFhZd0pDTGlJVE8zVUROd1VqTndBakk2SVNaazkyUWxSWGFUSjJicUpDTGlnak00Z0RNd0FUTndBakk2SVNaazkyUXlWV2J2UjNjMU5tSXNJQ000RXpOaW9qSWxSMmJEbG5iaEJYYnZObUk3dGxPaUVHZGhSbUlzMG5Jd0ltVDRnSFNybFZWanBWTVNoVlJKZDBNdWgwWnBkM2J1dDJjalYyWllWM1U0dG1TMVJHVndoM1o0WmtWalJIWlM5V2NXOWxkTDVtYXpnMFMwNUVOeUprUWYxa1pCMVNhV0ZtU3cweU1ObG1SMnNrTmlobFR3MUVhS2htTVFsRWFDdDJOSnhVYlJSVFNOSkZiS2RWVHJwMFJhbG1VeTRrYUdwWFQwbGthWnBHYVV4RWVWZFVUd0F6UVBsbVQ2NUVkSkpqVHFaRlZhaFhTNjUwYUZGVVFpb2pJdVYyYXZSbklzSVNSaTFDWlhCRlN6UTFSMzBFZE8xVWNNNVVPWjlGTXpRRVQwRVdMRjVVTWs5bVV3MUNWMHhXUnpNa1d1Y1dXMmNWVk9sMU56UUdVc2huYU9OWFpFaEVPcWgyVHdwR04yWkdXSnAyZHFCSGVORjJRMmhFVHFWa2FJWlhNQmxXTDJRRU9vVm5SWVYzZE9oV0x3QjNTeXBsWlY1Mk0wZFZNRzVtVDBOWFVvRkhlTmhYYTNaVGJVUm1lTVYyUlBkV09VVkZXTFZWV0lka1J4RVhReEpsUnU5a1VvaG1iUEZUY0h0VWVCSm5iZjF5VmhSVlYwZ1dTck5YZG9WM2NPMW1VaVJFV3RVbWIzazBVR05FY3h0V1NXbERiemhXYjBKMU1XQjFORTkyYjFnMFMzTVRUMFJWYTRjbWI0SlVSNUIzTVlGa1JWRjJWUFJFUzBGMGRMTm1hUHBrWmhkbk5pbGpNeElrYUNsa1ZuaDJiNjFtZHlrVFlOMWljeHAxTkhOSGJ6MENOeGtsTkpWV2VsSlZUSDFXZUxGRldtcDNic1JUT3h0Mk4xVUdiWHhFTVRWRFI0NDJYdEoyY0VOelNRWkdaRmRVVnM1Mk5ZOTFYRWxFWjVRa1VuWlVRclJHUktWMmF5QW5WTWx6YVRoWE9tQkZOemdGVmZsM1ZoZG5icDlWU09oR081UTNiVFoxVk1aMFIzMGlhSGQxUUdGSFQwWVRPVUZ6Wnhwa2RFcEVSeDhWWlFKR2QyUmtTSGgzVXFwR1J5Y0hTellqWU1aV01qVjNOMVFITjYxV2VYZFdieUFETXFkM012bG5SakZFVERsa1RsOTFOMkVUVlJsbVVDWkVkdlJFY0NWRU92UlVXeFYyVlhoR1RVdEVOeGRXUjQ0VVp2QmxjM1VuVVRwWE5sUjFWREJEUzZKblU0NUdOWk5GT0VsbWRXRjJRNWQyYnFaRWNEWjNhb3hXT1FCVlZ1WkhVeEExWk9SM1Z3Vm5RQlIxTXhVV2V6azNSa05WUjRjMFZGTjFkdTVXWlNWV0w0VkZTanBGY29sa1c0a21VSkZEY29oMlNoMVNhT3gwWkhGVFJsZDJRVHBYYndCbFlWZFhWTlprYjVnMGJ5bDBhNlIwVnBsV1NwaEhkZkJIV2xoR011QkhWclZYV0xGa010QVhhUGRGY3RFbVRYMXlUNWdrWVM1RVppQjFhM1lqWlZCRk53bFRjNmwyUVM5bVd4Wm1jUUZWTHU5R2RxNW1Nd1EwY1k5MFYxUkhVdGhYWTBCMVhhTkhaVUJEZHFOalNuaDJkRHAwYzBnSGFwUlRZU2QxWVpoRlRJVldkcFZVV1pCSGF0Y1dWV1oyVEtaRk53STFhVk5GYXRJMWQxaFdRbjEyWjFZbWQ0SlRlaFZrTklSRVp5c1dSc2QzUkdwVWN1WldPR2x6TUhsRE1CcEVadzlXZHhnemNhZG5WQzVXTHlsRFIwUURXeGtrWXpwbmN0a21URWRsVXlnVVJSQnpkMzhWUWloVVo0VWpaZmhsYzNZbGIzaDJSaGQwUjQ0MFJ2ZG1jREpIVzF3bWNuWkhWb2R6WUlOM001a21ReEUzUkpKWGRyWkdhekJWWXlRa1daNWthYWhIYnlCRlpScFZZMFVGTlVWM05hbDNhcmRXZDZaMlQzVUZOUUZHYjJNMmFzRlVVMFVUV1NWV1o0VmpkTFZEVWFwMGJJSkdlcmh6Ykhoa1VDVlhWd05uVHlobVdJWkZOdFIxTXhFemRRSmpNdWQzU2o5RlJDWjJaU0ZWVkZWSFN0cDNibk4wYTZ4MGJvSm5TalpqZWpOVVJHWjFRUVpEVG5KVFR1UkVTMU0yYkpGamEzWW1WazUwZFZKVk01SVZMMUIxWkxSalJHTmpaUmQxVWxKSFZuMWljRU5UV3kxMGIxb0dSSE56WUNkVE4yUTJheWMyVDZSRGJ6RkVUaFZrVlk5VVVtZDBid3BYWXVSa01LZHphU2RIVTJoMk1IaEZOVFZtV29CMWRrMUVWa2hEVnlWV2M1TTBSdUJGVFpOVk01cG5UekUyTVk5a2FUTjBkejFDTnRSbk5rVjBVc2RuZHJ4Mk0xRkVaMzlsU1ZkbWJ6NDJUWkpVVzI4RmE2Vm5lU1ZGVFRGbmFXQjNUalpYVlJCRlpMSkVjNXdtTUJaV01mdDBhM2R6WlAxVVEyZG5acVprYUVoMmNOQkZOT0oxVnpFemJ0WmtNS05XVDNnM1pUbDNOVDEyVm1WMlZWUlhjRzVFWnQ5bGFHcDJUTFpsU05CM1E0a1dNdUJWWUtGWFJ0SVZTcmRUY3pCM1hKdEdkdVJrUVBGRk00aDBaMmNuWXhCblFCWm5kUVpsZHhNbWJ1TlZXT1ZUYkZWek55UmxkNUl6YzBBbloyeFdhYU5sVXFGMVp6Y1ZUVWxqWmtWbGNCSmtVWTlFY3N4MFFySm1hbWxYYXpNSFRqeEViVFZHZVBCRFRObFRXd2x6VENGV1ZUWjNTenAyVTVsSE00QlZOdGhWVXdaelVvbEhPeEZHU3ZwV2J0UlhjYUpHVXpVelVGZFdaZnBYVFZWVlFKRkdWUGxtWVlSMmFyUkRPQ1ZrYTRwRWR3ZHpkMUluZHNkV1lKUmpkQnRrYldORU5pWm5ZVjlVYzNkR1IxY1dWTHAzTVRSSFpuWkRiNkpXWXprVGV5SUdaQ2xIVXFoR01mSjJYMWRVVTNGR1ZNNTBYM0J6VnQwMmN0bERNRzlFWnRSMVk1VVhPNk5IZDVFalVaSjFObGwwZHRWRFNTTmtNaXQwYXcxQ05VZGpUSkZHUzNZRWRPaDNWdEEzVmhabVN5TjFZdXhrUjI0a2JMOWtXNE1WTzVwRVR5RlZWV2RGY1JaWGQzTmtlRE5FT0lsMmJNUmxiM1VXV2FCWGRMRnpRWTlrWnJSVU40UUhXNVZqYUx4bWF0WkRPaEYxY25KME41OWtUWTFHT0dkMVpRZEROemNVZXhBVGRzTlZjVnBFT0RSMVprMVNld05XVWw1RU1wbG1UNGx6WHBOa2UxRkhPWWxYUjZaR1UyOVdjeEVYTk9sSFdJTkdkMjgwUndGV0xoRmphVEYxYXhWVWRMVm5OTUZrUlhSRmNDWmpOazVFTlpKbFFRUm5hS0ZYVFhOM1RLaFdTb2hUY0JsMmJPbFZlc0ZsUkRwMlI1TTBZR2gzU3BwbVFvWldTU2h6ZDJ3RU1pSmtkUlpXWkVKMFZhTm5kd01sVDFSbVowNEVPdWhYYXBaa1VZOUdVb2hFTnVaVk5HQm5jZnBtUzZ4R09LZFhOM1VXZTBJMlNCOVVkU2xqYWFaR2J1UjNRNFVqU2E5bFNoWlhWTWRIT01KRlp6bGxkMk1YV0tWVk16ZFZWekZIVTFrM01KZGxWeDhWVHkwMGJLcDFWUmRYTnhORVN6cDNWV1ptVG1CM1FRdFdlSFZETnRoWFZzSlhWalJUZVdabWNIWldicGRtYTBJM1FvOWtWV0ZuVWhkSE40azFYanBYUWtkRVJQbDJkekFEWnRObmRJcEhjMU1WY1pCbGUzNWtRdTlGYUdWVFJzZG5lVWxWU25KRVRKaFVVekZFU3ZoR09NWlVVaE5qUjNkMFR0RUZNNVpqUjJVelVvWldVeW9XT1RKbVR6c1dOVGQxWEhKR1pvcFhleUZHYlhGMFFVVkZPbDlHYVQ1VVlRUlhWZlIwVTFzMFlDUm1hSU4xVm9obmFrNWtReGNrZTJwRk5rcDJNd1lrZHdJMGJVWjNUVEprYWZWVVZ3TW5UWFZVY1FSMFI0MTBSUU5EVHBWR015SldMeVJrUVpWVlZ0c1VjeW8yWFpwR1dPNVdWMjFpWTJkblIxVjBObWRGYTRrbWVpbDBZQ1JYUjJ3VU53OTBiMmdHVHlZbU5EaDBOQ3AwYTJ0V081b1VjUnBsYnRvVVRXZFdSUWwwWVRGbmJQTkZSSnQyVDRoMlYxMUdWb2RGVFJkbllmbDFjRFZsUXJCbmV0MHliMFFqTkRWR1JaUjJUYUZUV1hSelhoQnpSelpEY3dObFZ0bG5RR1pUUkhoM1FObERPV2htYUxkVldCTm1kV0oxWHhZbWVxSm5RV3AzWlBwbWR2RkZhbVJFTXprMU12bGtWMEFuUm9abWV6OUZVcVIwWmZwVVJabFdNakoyVjFCblEzZFdjMllVWnoxU1dKTnpaT0pWUzVFSE1JbEdkMFFuTFJGbk55b0hibE4zZDY1a05UaFhUMDFtTXJWbk42NXlkclp6U2hobU50Z0ZSNU5FVjRWMmRWUjFUeUlYY3ZSWGNZVkZaNWRIVnFGa2RNVlVZeGNrTjJGVFk1OFZkb2xXTnMxMlhqUkdacE56VnVaRWQzSUVVMTlVVTFnMGR6cFhlMkozU0NkbVUzSkVXTE5GVUxSMWRHZHpZdWQxVTJFVmRVRkRjS0JUVzBORFo1cFZUd3hHZHNkRlpVVjFiS1pFU1dOWE9SOVVOVDkxZHBGa2JRVm1SRFJFYkN0RVN3WkdPdE5GZHdrMVFvRlRPUkZ6YTVwM1NXOUVVb0JUYjBaRVVyWlRUNGgwYXBWMlp3bHpjQ2RUUVFGbVduOW1aMUZsWjVNa1Ixb1VhQ0ZEV0xoV01WWjNYS2xuYWFCWGVvbFdUWDkyTVM1R01mSkZVbTVVVzNkMmF5WlhhMlprVU9sVU5UTmpiRFozU3hsMWNGaDFWTE4xTktwSE1pTlVZcVpUUWZoMmRYTm5ZNTUwVHV4bWF3SUdOYTkxYUJsMVFWWlRTVlJUVUhaalI1UVdPeGRUTVRCbFZuVnpRSkJIT1FkR2M1Y1dNUE5uU2lORlY2SldaczlVWlQxaVFpTlZZUUJUU0ZwV1ZYTmpMdzRXU1ZSR2JUbDJicWxVTlNOVFdwZFhhSkpUVnExRWRCWmxVQ2xUVk1Ka1RzVlZhdnBXU3VoM1ZabDJkcGxVZUZSbFRVaFdWTVJrU3dFbE1WcFdUQ3BVYVBsV1R0SkdiS2xYWmlvakkwZG5haXNuT2lNSGJobEdkdVZHWmxKM1lpd2lJMEpYWWoxeVp1bEdjdzlHYXpKaU9pYzNib04xYlU1V1psSjNZekpDTGlvMU54SWpMMU1qTzNNak95RURWekFUTHdFVEwzRURNeUlpT2lVR2RoUm1Jc0l5YzA1V1p0bFhZdzF5Y2xOV2F2Wm5icEppT2lBSGNCVjJZeVYzYnpKeWU-"))

        var retrievedObject = localStorage.getItem('tempCashOrders');
        console.log('tempCashOrders: ', JSON.parse(retrievedObject));

        // let manager = localStorage.getItem('manager');
        // console.log('manager: ', JSON.parse(manager));
    }
}
