import { Inject, Injectable, Optional } from '@angular/core';
import { HttpModule, RequestOptions, Headers } from '@angular/http';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Api } from './api/api.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/observable/ErrorObservable';

@Injectable()
export class SessionService {
    static AUTH_TOKEN_VERSION = "auth_token_version";
    private _endpoint: string;
    constructor(
        private http: Api, @Inject(SessionService.AUTH_TOKEN_VERSION) @Optional() private authTokenVersion: string) {
        this._endpoint = authTokenVersion ? `${authTokenVersion}/secm/oam/oauth2/token` : "v2/secm/oam/oauth2/token";
    }

    get isLoggedIn(): boolean {
        return sessionStorage.getItem('access_token') != undefined &&
            sessionStorage.getItem('access_token') != "" &&
            sessionStorage.getItem('jwt') != undefined &&
            sessionStorage.getItem('jwt') != "";
    }

    private clean(): void {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('jwt');
        sessionStorage.removeItem('user_profile');
        sessionStorage.removeItem('user_customer');
    }

    private generateUrlString(user: string, password: string): any {
        return "grant_type=password&scope=security&username=" + user +
        "&password=" + encodeURIComponent(password) +
        "&client_id=" + this.http.clientId;
    }

    private processDataFromLogin(data: any): void {
        sessionStorage.setItem('access_token', data.oauth2.access_token);
        sessionStorage.setItem('refresh_token', data.oauth2.refresh_token);
        sessionStorage.setItem('jwt', data.jwt);
        sessionStorage.setItem('user_profile', JSON.stringify(data.profile));
        sessionStorage.setItem('user_customer', JSON.stringify(data.customer));
    }

    loginHeaders() {
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
                'accept': 'text/plain, */*',
                'X-IBM-Client-Id': this.http.clientId,
                'App-Code': this.http.appId,
                'Accept-Language': this.http.getAcceptedLanguage()
            })
        });
        
        return options;
    }

    public logout(): void {
        this.clean();
    }

    public login(user: string, password: string): Promise<any> {
        this.clean();
        return this.http.post("/v2/secm/oam/oauth2/token", this.generateUrlString(user, password), this.loginHeaders())
            .toPromise()
            .then(response => {
                this.processDataFromLogin(response.json());
            })
            .catch(error => {
                return Promise.reject(error);
            });
    }
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private sessionService: SessionService) { }

    canActivate(): boolean {

        if (this.sessionService.isLoggedIn) {
            return true;
        } 
        else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}