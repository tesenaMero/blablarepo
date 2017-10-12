import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { WindowRef } from '../window-ref.service';
import { Broadcaster } from '@cemex-core/events-v1/dist';

const d = new Date();
const sessionId = btoa(d.toISOString().replace(/-/g, '').replace(/:/g, '').replace('Z', '').replace('T', ''));

@Injectable()
export class Api {
    public apiRoot = (<any>global)['API_HOST_FULL'] || 'https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev';
    public clientId = (<any>global)['CLIENT_ID'] || 'dd2ee55f-c93c-4c1b-b852-58c18cc7c277';
    public appId = 'DCMWebTool_App';
    public acceptLanguage = 'en-US';
    private jwt = null;
    private authorization = null;    

    constructor(private _http: Http, private winRef: WindowRef, private eventBroadcaster: Broadcaster) {
        if (this.apiRoot.slice(-1) == "/") {
            this.apiRoot = this.apiRoot.slice(0, -1);
        }
        // OnChange Legal entity
        this.eventBroadcaster.on<string>(Broadcaster.DCM_LEGAL_ENTITY_CHANGE)
            .subscribe((response) => {
                this.getLocale();
            });
    }

    public get(url: string, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders();
        return this._http.get(`${this.apiRoot}${url}`, options);
    }

    public post(url: string, body: any, options: RequestOptionsArgs = {}): Observable<Response> {
        if (Object.keys(options).length === 0)
            options.headers = this.getHeaders();

        return this._http.post(`${this.apiRoot}${url}`, body, options);
    }

    public put(url: string, body: any, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders();
        return this._http.post(`${this.apiRoot}${url}`, body, options);
    }

    public patch(url: string, body: any = {}, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders();
        return this._http.patch(`${this.apiRoot}${url}`, body, options);
    }

    public delete(url: string, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders();
        return this._http.delete(`${this.apiRoot}${url}`, options);
    }

    private getHeaders(): any {
        let headers = new Headers();
        headers.append('Content-type', 'application/json');
        headers.append('Accept-Language', this.acceptLanguage);
        headers.append('App-Code', this.appId);
        headers.append('x-ibm-client-id', this.clientId);

        this.authorization = sessionStorage.getItem('access_token');
        this.jwt = sessionStorage.getItem('jwt');

        if (this.authorization)
            headers.append('Authorization', 'Bearer ' + this.authorization);

        if (this.jwt) {
            headers.append('jwt', this.jwt);   
            const time = new Date();
            headers.append('sessionId', sessionId);
            headers.append('RequestDateTime', time.getTime().toString());
        }
        return headers;
    }

    public setAcceptLanguage(language: string) {
        this.acceptLanguage = language;
    }

    public setToken(accessToken: string, jwt: string): void {
        this.authorization = accessToken;
        this.jwt = jwt;
    }

    public clearToken(): void {
        this.authorization = null;
        this.jwt = null;
    }

    public getLocale() {        
        let language = localStorage.getItem('language');
        let userLegalEntity = JSON.parse(sessionStorage.getItem('user_legal_entity'));
        if (language && userLegalEntity){            
            this.acceptLanguage = language + '-' + userLegalEntity.countryCode.trim();
        }
    }
}