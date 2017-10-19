import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class DashboardService {
    alertSubject = new Subject<any>();
    constructor() {}

    alertInfo(text: string, duration: number = 8000) {
        this.alertSubject.next({type: "info", text: text, duration: duration, translation: false });
    }

    alertSuccess(text: string, duration: number = 8000) {
        this.alertSubject.next({type: "success", text: text, duration: duration, translation: false });
    }

    alertWarning(text: string, duration: number = 8000) {
        this.alertSubject.next({type: "warning", text: text, duration: duration, translation: false });
    }

    alertError(text: string, duration: number = 8000) {
        this.alertSubject.next({type: "error", text: text, duration: duration, translation: false });
    }

    alertTranslateInfo(key: string, duration: number = 8000) {
        this.alertSubject.next({ type: "info", text: key, duration: duration, translation: true });
    }
    
    alertTranslateSuccess(key: string, duration: number = 8000) {
        this.alertSubject.next({ type: "success", text: key, duration: duration, translation: true });
    }

    alertTranslateWarning(key: string, duration: number = 8000) {
        this.alertSubject.next({ type: "warning", text: key, duration: duration, translation: true });
    }
    
    alertTranslateError(key: string, duration: number = 8000) {
        this.alertSubject.next({ type: "error", text: key, duration: duration, translation: true });
    }
    

    closeAlert() {
        this.alertSubject.next(null);
    }
}
