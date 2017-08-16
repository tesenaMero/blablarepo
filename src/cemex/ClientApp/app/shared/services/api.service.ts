import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { WindowRef } from './window-ref.service';

@Injectable()
export class ApiService {
    private apiRoot = this.winRef['API_HOST'] || 'https://api.us.apiconnect.ibmcloud.com/cnx-gbl-apiconnect-org-development/dev';
    private clientId = this.winRef['CLIENT_ID'] || 'e2824d38-9871-4d41-9d36-466993d97ee5';
    private appId = 'DCMWebTool_App';
    private acceptLanguage = 'en-US';
    private jwt = null;
    private authorization = null;

    constructor(private _http: Http, private winRef: WindowRef) { }

    public get(url: string, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders();
        return this._http.get(`${this.apiRoot}/${url}`, options);
    }

    public post(url: string, body: any, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders();
        return this._http.post(`${this.apiRoot}/${url}`, body, options);
    }

    public put(url: string, body: any, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders();
        return this._http.post(`${this.apiRoot}/${url}`, body, options);
    }

    public patch(url: string, body: any, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders();
        return this._http.patch(`${this.apiRoot}/${url}`, body, options);
    }

    public delete(url: string, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders();
        return this._http.delete(`${this.apiRoot}/${url}`, options);
    }

    private getHeaders(): Headers {
        const headers = new Headers();
        headers.append('content-type', 'application/json');
        headers.append('Accept-Language', this.acceptLanguage);
        headers.append('App-Code', this.appId);
        headers.append('x-ibm-client-id', this.clientId);
        
        if (this.authorization && this.jwt) {
            headers.append('authorization', 'Bearer ' + this.authorization);
            headers.append('jwt', this.jwt);
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
}