import { SessionService } from '../services/session.service';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Broadcaster } from '../types/Broadcaster';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TranslationService {
    public static translation: Map<string, string> = new Map<string, string>();
    public static language: string = '';

    constructor(private _http: Http, private eventDispatcher: Broadcaster) {
        if (TranslationService.st('lang').indexOf('NOT:') !== -1) {
            this.eventDispatcher.broadcast('LANGUAGE_LOADED', false);
            this._http.get("/ordersnproduct/locale-en.json")
                .toPromise()
                .then(response => {
                    this.eventDispatcher.broadcast('LANGUAGE_LOADED', true);
                    return this.populateTranslation(response.json());
                })
                .catch(this.handleError);
        }
    }
    public static st(textID: string): string {
        if (this.translation.get(textID) === null || this.translation.get(textID) === undefined) {
            return 'NOT:' + textID;
        }
        return this.translation.get(textID);
    }
    public static all(): Map<string, string> {
        return this.translation;
    }
    public lang(lang: string): void {
        TranslationService.language = lang;
        this.eventDispatcher.broadcast('LANGUAGE_LOADED', false);
        this._http.get('/ordersnproduct/locale-' + lang + '.json')
            .toPromise()
            .then(response => {
                this.eventDispatcher.broadcast('LANGUAGE_LOADED', true);
                return this.populateTranslation(response.json());
            })
            .catch(this.handleError);
    }
    public file(url: string): void {
        this.eventDispatcher.broadcast('LANGUAGE_LOADED', false);
        this._http.get(url)
            .toPromise()
            .then(response => {
                this.eventDispatcher.broadcast('LANGUAGE_LOADED', true);
                return this.populateTranslation(response.json());
            })
            .catch(this.handleError);
    }
    /**
     * st comes from static-translation
     */
    /**
     * pt comes from public-translation
     */
    public pt(textID: string): string {
        if (TranslationService.translation.get(textID) === null || TranslationService.translation.get(textID) === undefined) {
            return 'NOT:' + textID;
        }
        return TranslationService.translation.get(textID);
    }
    /**
     * gets all translations
     */
    public getlang(): string {
        return TranslationService.language;
    }
    private populateTranslation(result) {
        for (const item in result) {
            TranslationService.translation.set(item, result[item]);
        }
    }
    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}
