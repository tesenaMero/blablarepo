import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { WindowRef } from '../window-ref.service';

@Injectable()
export class Api {
    public apiRoot = this.winRef['API_HOST'] || 'https://api.us2.apiconnect.ibmcloud.com/cnx-gbl-org-development/dev';
    public clientId = this.winRef['CLIENT_ID'] || 'dd2ee55f-c93c-4c1b-b852-58c18cc7c277';
    public appId = 'DCMWebTool_App';
    private acceptLanguage = 'en-US';
    private jwt = null;
    private authorization = null;

    constructor(private _http: Http, private winRef: WindowRef) {
        // this.setToken(
        //     "AAEkZGQyZWU1NWYtYzkzYy00YzFiLWI4NTItNThjMThjYzdjMjc3NLP-wDzaZMIQkhjveQCc6612G00KbKgS7LnaYWtgiKywTTgVsV0Mq8v03Iibmp2qkwmqT7gY7Cb7hsbhNE6PjCNHr3FEgs1NzW4ocjaKLGE",
        //     "eyJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiUlNBLU9BRVAtMjU2IiwiY3R5IjoiSldUIn0.k0mUckSJxpElH0gLm0O1OoIImTeRfJ0bqrJsJCGHvCXIBT_Hooc1NxbaC2CF6xuGXCbQU-db3SXiOiNZLlXbxkF9_U7NJo8iNpTVntu_4i-DtjGhsBNKb1mLcwBuqG99pe_N98ACEyyHUPVLfC7FiR4anHYg-LOM32Gw0NxPyl2fdSSw6EbyAINPFWcpXAWuep2_HxFBGPjGUkfvHifbx-gtJlJY5sjx25SzWKoU-vDR_JwIez5Bjv1yD7D1UIlx4F8flQoBrFm2vAu0GQYIJKff0qjRfauvtjK4XPI3OujNBbMDpK7MokybE_4SExQ2IM3AukOYxTBixmzvZ0PPxQ.vEF9aC-Rp06fl2VH6n7kjQ.sst2MIY08OMht2XkUVqHNAN0z9R7jYouvJAFQ-0hK3i9FVvNkdE5QqMxx-VTDOTUieoXogqoPpgu0lb6eGHL4kN22rgs1-xRvnQrhpvVuWRTEqdlWJZUxUGtwgNFg5b7kUmtoyD1uwOXVh02XlTCUKnEsL7Eh6W5suu5Gt1B9P2uq7484eHGxfh9BqPEiZEQLQa68bgUEY-wUdG8usmor0qAHbcqF0UN7jamqMjnvZNnidTyNA5SOSlCvBYttYHkFsHsN3uYIWfM2fnZRpnU1VpSFnt7Flc4_-DmDc9qWp9f21JYYKbtsCFSYLCR1weD8Gq83KkcXI5yZvdErzLPlNi2cREHyE0f8fdAe2ywzJM0eNn-SA3tz2gl9nV2g3yey5pey0ajPKKTi7Z43nLyLn66pEh91oICGQFjNg0bIE-Clj4nAEeMVYY2oI_Dmjv6n70hLZFqoounmv5ndjby6P9O_c1xeebkGGpAJvrBfdDv97Qcf9OACDEp9jo46vthmVwKL13fAnCKjhwe3Dm0RgIkO-NPDOByNuiPdxR-I6rPRqWpG_LcX0kIsvF0ryrYhnwbFxghTjDy0gezSy2B7ZGptdMKw8QdKtVqOyrrGW-JWwUripMW_GK26ZhttwdgmqrGH_TYtdk9zKvQrpWVP79OeLV9oExzlF5nQZ6WPctjUSfXUl-d9nTvKmHJIb8CS2svrB1lmhgEuV1QNFTG0aEQMpeKlhK0HNLi2zsc2J80HinvUCHpmXmL9ofUY5GhW1hKMC7O0xqm__2SlKPL_79ONaIWuPyrh9FkWNEZCo6F9j2kAYbYlf6C5-eUO94phbF0_I6-t-U8saXA_mtLGi_DboJEOcM_RYwaJ49MZzXhDzm1zGRCt1hqeavqli74MUTXyrFBTef2TQR_KXNKNRsgNIKa3EqZAQa7ibK5pRmjAlMhzS9x0rW804g84ymLun5K-I5DveCIZTP5jHNysKkl6hqxvrK5Ea7VKXZRZb4rgHQCBaTeSLRA701NbgvPK4RwIHjMRWCkxKgxeYA2cvBPmdXzwjYbKAIbPa-lFHGVzY35HYx-7YWkcLVRsrqTrjQqa5-H0zRyrsOG9M891j9yHhuERxNZ7IwZQNIzGOZhLsC3vVfVItCW9SfWKz6V86SHH2RLZoWYlDkW2Z027PAlyIYr0_7fRO45LxFl7MaD49wymHuy3S2yHiqkYD67VoIl6RGwDextCaO2gx4APQSWZ0sXKQMta7YpvtrFITxnMHeH0ZONO7vN8_NUPXL-UGtJ3MUeHHMw3e4zDIKudc_ra3Wyxuk_bXN3AM8tDByV8ppPYG85cKxvqlKvXsqF-R9DnnsLXDjkNCdCv-uJrAVlsL3yI93HRfvPSrwJwbQz4qt9VCyoZyLj5xohicFrVvtr_TJENXZ--5Qs06xzWoA_1-VlixfaaMFXF8qUxhbszg2nZ--dI9JTXd_0QZFIzwldEablukO_EmedYxVURmui1ELR15Tuj99hVij3Ti2k5aGkPtQBIChnBovBGhgcW4iIGtYfFF2jGoK6dxypDY_DqIx2uv0zlmyIVkzQT8KSEoLqV-YqOW7vvvXcAR7Uvf6YHVfg0ENc_Kk0XpSEVfocZBNcjBa29xoE59HCdniL_bGoHwy7FxX99TK9cdQDrRNsbIBbmJbFz_kSprzPe0BA1E_14iKSFW1eaiPi-7Gc_H7kJxZ5U6_5ZagNkVsCQ84kLQQjI1icO84i4mP-RCXaF8IOKjvQwgNfP_NA5s_Q3ojM6SnCHrrlXPwL68jKX04-Hvi0n_G-SDzBsgtYkSAxvpAsJlAZXh5ukNFiMSDKNBFwQ7pYQIb25PTciIxsXgyFJ5Po-sqcEvs0VQgJkoWVKiognvJdTu4enVxmiTLDFZbeE0GPLn6P99qfBpF_HskiwAZWsVzp8agPcV2sJavwhaAg1_uzUqDAIUzpPwfitzQRSEGmszmcAdB1MAgpw_sFyvQR3ueT4i1FfsFsH9Ub02bb5qC2DUGXVN9P6LdHsKP87Itqi9QNQIgoRvqrMSGVzxFwtpyNm5eL31rCXst1C9gG22LFPTJBJLGDL2FT3JvyhY2PDWlT_2HxGK75kQlzEo9JwmPa95epW2m1KzujR6NGwg3QGpCpVsU3dj9jgoK0FePn3Naz_mr3lHfQE2uQEHOvHbJetWlhnfWUcEozmh_et8JjiQpg4t8GZFPgnoLyDdL6EeevfZsUwEXCLAXykWkrgNXqOkOsRvEf0YBzYwvIYFknX3UHJ_da6jtysVM4zOM5TKG_VHWmBvw0YX3SQKn87AceEHwHPAAT-02YNWL44noIw7f6-WlxTw53p_76CjdtTvI1N8oARZ8OT6wJ-8eO9Ge-sgW1CDKP9ht6VyrvIyM0-FKGInZSQ48.tYo-5Czj1ZdsjTYLlEzLEVjKiycEKWl4-9b45Fs5ljo"
        // );
    }

    public get(url: string, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders(options.headers);
        return this._http.get(`${this.apiRoot}${url}`, options);
    }

    public post(url: string, body: any, options: RequestOptionsArgs = {}): Observable<Response> {
        if (options == {})
            options.headers = this.getHeaders(options.headers);
        return this._http.post(`${this.apiRoot}${url}`, body, options);
    }

    public put(url: string, body: any, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders();
        return this._http.post(`${this.apiRoot}${url}`, body, options);
    }

    public patch(url: string, body: any, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders();
        return this._http.patch(`${this.apiRoot}${url}`, body, options);
    }

    public delete(url: string, options: RequestOptionsArgs = {}): Observable<Response> {
        options.headers = this.getHeaders();
        return this._http.delete(`${this.apiRoot}${url}`, options);
    }

    private getHeaders(headers = new Headers()): Headers {
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