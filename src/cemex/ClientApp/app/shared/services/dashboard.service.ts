import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class DashboardService {
    alertSubject = new Subject<any>();
    constructor() {}

    alertInfo(text: string) {
        this.alertSubject.next({type: "info", text: text});
    }

    alertSuccess(text: string) {
        this.alertSubject.next({type: "success", text: text});
    }
}
