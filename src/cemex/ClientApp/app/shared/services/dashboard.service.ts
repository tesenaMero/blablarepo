import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class DashboardService {
    alertSubject = new Subject<any>();
    constructor() {}

    alertInfo(text: string, duration: number = 8000) {
        this.alertSubject.next({type: "info", text: text, duration: duration });
    }

    alertSuccess(text: string, duration: number = 8000) {
        this.alertSubject.next({type: "success", text: text, duration: duration });
    }

    alertError(text: string, duration: number = 8000) {
        this.alertSubject.next({type: "error", text: text, duration: duration });
    }

    closeAlert() {
        this.alertSubject.next(null);
    }
}
